import os
import json
import uuid
import datetime
import psycopg2
from psycopg2 import pool
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional
from app.core.security import encrypt_data, decrypt_data

load_dotenv()

class DBService:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
        try:
            # Création d'un pool de connexions pour l'efficacité industrielle
            self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                1, 10, self.db_url
            )
            # Client Supabase pour Auth
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_KEY")
            self.supabase: Client = create_client(url, key)
        except Exception as e:
            print(f"CRITICAL: DB Connection Error: {e}")
            self.connection_pool = None
            self.mock_db = "mock_db.json"

    def _get_connection(self):
        if not self.connection_pool:
            return None
        return self.connection_pool.getconn()

    def _release_connection(self, conn):
        if self.connection_pool:
            self.connection_pool.putconn(conn)

    def create_reminder(self, data: dict, user_id: str) -> Optional[Dict[str, Any]]:
        """Inserts a new reminder with initial OCR data and file URL."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            query = """
                INSERT INTO reminders (
                    user_id, client_name, client_email, client_phone, 
                    invoice_number, insurer, iban, amount, due_date, 
                    status, ocr_data, file_url
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """
            cur.execute(query, (
                user_id,
                data.get('client_name'),
                data.get('client_email'),
                data.get('client_phone'),
                data.get('invoice_number'),
                data.get('insurer'),
                data.get('iban'),
                data.get('amount'),
                data.get('due_date'),
                data.get('status', 'pending_validation'),
                json.dumps(data.get('ocr_data', {})) if data.get('ocr_data') else '{}',
                data.get('file_url')
            ))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result))
        except Exception as e:
            print(f"Error creating reminder: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def get_all_reminders(self, user_id: str, status: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = self._get_connection()
        if not conn: return []
        try:
            cur = conn.cursor()
            query = "SELECT * FROM reminders WHERE user_id = %s"
            params = [user_id]
            if status:
                query += " AND status = %s"
                params.append(status)
            query += " ORDER BY created_at DESC;"
            cur.execute(query, tuple(params))
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            print(f"Error fetching reminders: {e}")
            return []
        finally:
            self._release_connection(conn)

    def get_reminder_by_id(self, reminder_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM reminders WHERE id = %s AND user_id = %s;", (reminder_id, user_id))
            result = cur.fetchone()
            if not result: return None
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result))
        except Exception as e:
            print(f"Error fetching reminder {reminder_id}: {e}")
            return None
        finally:
            self._release_connection(conn)

    def update_reminder(self, reminder_id: str, user_id: str, updates: dict) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            fields = []
            values = []
            for k, v in updates.items():
                fields.append(f"{k} = %s")
                if isinstance(v, (dict, list)):
                    values.append(json.dumps(v))
                else:
                    values.append(v)
            
            values.extend([reminder_id, user_id])
            query = f"UPDATE reminders SET {', '.join(fields)}, updated_at = NOW() WHERE id = %s AND user_id = %s RETURNING *;"
            cur.execute(query, tuple(values))
            result = cur.fetchone()
            conn.commit()
            if not result: return None
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result))
        except Exception as e:
            print(f"Error updating reminder: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def get_stats(self, user_id: str) -> Dict[str, Any]:
        reminders = self.get_all_reminders(user_id)
        total_recovered = sum(float(r.get('amount', 0)) for r in reminders if r.get('status') == 'sent') # Simplified logic
        pending_count = len([r for r in reminders if r.get('status') == 'pending_validation'])
        sent_count = len([r for r in reminders if r.get('status') == 'sent'])
        
        return {
            "total_amount": total_recovered,
            "active_reminders": len(reminders),
            "pending_validation": pending_count,
            "sent_count": sent_count,
            "recovery_rate": (sent_count / len(reminders) * 100) if reminders else 0
        }

    def get_settings(self, user_id: str) -> Dict[str, Any]:
        conn = self._get_connection()
        if not conn: return {}
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM settings WHERE user_id = %s;", (user_id,))
            result = cur.fetchone()
            if not result: return {}
            columns = [desc[0] for desc in cur.description]
            settings = dict(zip(columns, result))
            
            # Déchiffrement automatique des clés
            for key in settings:
                if key.endswith("_enc") and settings[key]:
                    decrypted = decrypt_data(settings[key])
                    if decrypted:
                        settings[key] = decrypted
            
            cur.close()
            return settings
        except Exception as e:
            print(f"Error fetching settings: {e}")
            return {}
        finally:
            self._release_connection(conn)

    def save_settings(self, user_id: str, data: dict) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            query = """
                INSERT INTO settings (
                    user_id, gemini_api_key_enc, resend_api_key_enc, 
                    twilio_account_sid_enc, twilio_auth_token_enc, 
                    whatsapp_bridge_mode, email_signature, communication_tone, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (user_id) DO UPDATE SET
                    gemini_api_key_enc = EXCLUDED.gemini_api_key_enc,
                    resend_api_key_enc = EXCLUDED.resend_api_key_enc,
                    twilio_account_sid_enc = EXCLUDED.twilio_account_sid_enc,
                    twilio_auth_token_enc = EXCLUDED.twilio_auth_token_enc,
                    whatsapp_bridge_mode = EXCLUDED.whatsapp_bridge_mode,
                    email_signature = EXCLUDED.email_signature,
                    communication_tone = EXCLUDED.communication_tone,
                    updated_at = NOW()
                RETURNING *;
            """
            cur.execute(query, (
                user_id,
                encrypt_data(data.get('gemini_api_key_enc')),
                encrypt_data(data.get('resend_api_key_enc')),
                encrypt_data(data.get('twilio_account_sid_enc')),
                encrypt_data(data.get('twilio_auth_token_enc')),
                data.get('whatsapp_bridge_mode', 'native'),
                data.get('email_signature'),
                data.get('communication_tone', 'courtois')
            ))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            settings = dict(zip(columns, result))
            
            # Déchiffrement pour le retour à l'utilisateur
            for key in settings:
                if key.endswith("_enc") and settings[key]:
                    decrypted = decrypt_data(settings[key])
                    if decrypted:
                        settings[key] = decrypted
            
            cur.close()
            return settings
        except Exception as e:
            print(f"Error saving settings: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def save_audit_log(self, user_id: str, action: str, details: dict = {}, ip: str = None):
        conn = self._get_connection()
        if not conn: return
        try:
            cur = conn.cursor()
            message = action.replace("_", " ").capitalize()
            cur.execute(
                "INSERT INTO audit_logs (user_id, action, message, details, ip_address) VALUES (%s, %s, %s, %s, %s);",
                (user_id, action, message, json.dumps(details), ip)
            )
            conn.commit()
            cur.close()
        except Exception as e:
            print(f"Audit Log Error: {e}")
        finally:
            self._release_connection(conn)

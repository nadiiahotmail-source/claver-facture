import os
import psycopg2
from psycopg2 import pool
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class DBService:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
        try:
            # Création d'un pool de connexions pour l'efficacité industrielle
            self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                1, 10, self.db_url
            )
            if self.connection_pool:
                print("--- Connexion PostgreSQL Directe Établie ---")
            
            # Client Supabase maintenu UNIQUEMENT pour la validation des JWT
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_KEY")
            self.supabase: Client = create_client(url, key)
        except Exception as e:
            print(f"CRITICAL: Failed to connect to direct PostgreSQL: {e}")
            self.connection_pool = None

    def _get_connection(self):
        if not self.connection_pool:
            return None
        return self.connection_pool.getconn()

    def _release_connection(self, conn):
        if self.connection_pool:
            self.connection_pool.putconn(conn)

    def save_reminder(self, data: dict, user_id: str):
        """Saves a parsed reminder directly to PostgreSQL, linked to a user."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            query = """
                INSERT INTO reminders (client_name, insurer, amount, due_date, policy_number, phone_number, status, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """
            cur.execute(query, (
                data.get('client_name'),
                data.get('insurer'),
                data.get('amount'),
                data.get('due_date'),
                data.get('policy_number'),
                data.get('phone_number'),
                data.get('status', 'pending'),
                user_id
            ))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result))
        except Exception as e:
            print(f"Error saving reminder: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def get_all_reminders(self, user_id: str):
        """Fetches all reminders for a specific user."""
        conn = self._get_connection()
        if not conn: return []
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM reminders WHERE user_id = %s ORDER BY created_at DESC;", (user_id,))
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            print(f"Error fetching reminders: {e}")
            return []
        finally:
            self._release_connection(conn)

    def get_reminder_safe(self, reminder_id: str, user_id: str):
        """Retrieves a single reminder while ensuring user ownership."""
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
            print(f"Error fetching specific reminder: {e}")
            return None
        finally:
            self._release_connection(conn)

    def update_status(self, reminder_id: str, status: str, user_id: str):
        """Updates the status of a reminder, ensuring ownership."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            cur.execute("UPDATE reminders SET status = %s WHERE id = %s AND user_id = %s RETURNING *;", (status, reminder_id, user_id))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result)) if result else None
        except Exception as e:
            print(f"Error updating status: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)
    def update_email_draft(self, reminder_id: str, subject: str, body: str, user_id: str):
        """Updates the email draft for a reminder, ensuring ownership."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE reminders 
                SET email_subject = %s, email_body = %s, status = 'drafted' 
                WHERE id = %s AND user_id = %s RETURNING *;
            """, (subject, body, reminder_id, user_id))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result)) if result else None
        except Exception as e:
            print(f"Error updating email draft: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def approve_email(self, reminder_id: str, user_id: str):
        """Marks an email as validated, ensuring ownership."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE reminders 
                SET is_validated = TRUE, status = 'validated' 
                WHERE id = %s AND user_id = %s RETURNING *;
            """, (reminder_id, user_id))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result)) if result else None
        except Exception as e:
            print(f"Error approving email: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def mark_email_sent(self, reminder_id: str, user_id: str):
        """Marks an email as sent with timestamp, ensuring ownership."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            cur.execute("""
                UPDATE reminders 
                SET email_sent_at = NOW(), status = 'sent' 
                WHERE id = %s AND user_id = %s RETURNING *;
            """, (reminder_id, user_id))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result)) if result else None
        except Exception as e:
            print(f"Error marking email sent: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

    def get_settings(self, user_id: str):
        """Fetches system settings for a user."""
        conn = self._get_connection()
        if not conn: return {}
        try:
            cur = conn.cursor()
            cur.execute("SELECT gemini_key, resend_key, tone, whatsapp_mode FROM settings WHERE user_id = %s;", (user_id,))
            result = cur.fetchone()
            if not result: return {}
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result))
        except Exception as e:
            print(f"Error fetching settings: {e}")
            return {}
        finally:
            self._release_connection(conn)

    def save_settings(self, user_id: str, data: dict):
        """Saves or updates system settings for a user."""
        conn = self._get_connection()
        if not conn: return None
        try:
            cur = conn.cursor()
            query = """
                INSERT INTO settings (user_id, gemini_key, resend_key, tone, whatsapp_mode, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (user_id) DO UPDATE SET
                    gemini_key = EXCLUDED.gemini_key,
                    resend_key = EXCLUDED.resend_key,
                    tone = EXCLUDED.tone,
                    whatsapp_mode = EXCLUDED.whatsapp_mode,
                    updated_at = NOW()
                RETURNING *;
            """
            cur.execute(query, (
                user_id,
                data.get('gemini_key'),
                data.get('resend_key'),
                data.get('tone', 'courteous'),
                data.get('whatsapp_mode', 'native')
            ))
            result = cur.fetchone()
            conn.commit()
            columns = [desc[0] for desc in cur.description]
            cur.close()
            return dict(zip(columns, result))
        except Exception as e:
            print(f"Error saving settings: {e}")
            conn.rollback()
            return None
        finally:
            self._release_connection(conn)

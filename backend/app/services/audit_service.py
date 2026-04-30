import logging
from app.services.db_service import DBService

logger = logging.getLogger(__name__)

class AuditService:
    def __init__(self):
        self.db = DBService()

    def log_action(self, user_id: str, message: str, level: str = "INFO"):
        """Logs an action to the audit_logs table."""
        logger.info(f"Audit Log [{level}]: {message}")
        
        conn = self.db._get_connection()
        if not conn: return
        try:
            cur = conn.cursor()
            query = """
                INSERT INTO audit_logs (user_id, message, level)
                VALUES (%s, %s, %s);
            """
            cur.execute(query, (user_id, message, level))
            conn.commit()
            cur.close()
        except Exception as e:
            print(f"Error logging audit action: {e}")
        finally:
            self.db._release_connection(conn)

    def get_logs(self, user_id: str, limit: int = 20):
        """Fetches the latest audit logs for a user."""
        conn = self.db._get_connection()
        if not conn: return []
        try:
            cur = conn.cursor()
            cur.execute("SELECT created_at, message, level FROM audit_logs WHERE user_id = %s ORDER BY created_at DESC LIMIT %s;", (user_id, limit))
            rows = cur.fetchall()
            cur.close()
            return [{"time": row[0].strftime("%H:%M:%S"), "msg": row[1], "level": row[2]} for row in rows]
        except Exception as e:
            print(f"Error fetching audit logs: {e}")
            return []
        finally:
            self.db._release_connection(conn)

audit_service = AuditService()

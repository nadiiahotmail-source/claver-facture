import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def cleanup_db():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in environment")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print("Deleting all reminders...")
        cur.execute("DELETE FROM reminders;")
        
        print("Deleting all audit logs...")
        cur.execute("DELETE FROM audit_logs;")
        
        # We might want to keep settings and profiles
        
        conn.commit()
        cur.close()
        conn.close()
        print("Cleanup complete!")
    except Exception as e:
        print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    cleanup_db()

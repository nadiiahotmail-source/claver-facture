import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def verify_tables():
    db_url = os.getenv("DATABASE_URL")
    print(f"Connecting to remote DB to verify tables...")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [r[0] for r in cur.fetchall()]
        print(f"Found tables: {tables}")
        
        required_tables = ['profiles', 'reminders', 'settings', 'audit_logs', 'memory_context']
        missing = [t for t in required_tables if t not in tables]
        
        if not missing:
            print("SUCCESS: All required tables exist in the public schema.")
        else:
            print(f"WARNING: Missing tables: {missing}")
            
        # Check pgvector extension
        cur.execute("SELECT extname FROM pg_extension WHERE extname = 'vector'")
        extension = cur.fetchone()
        if extension:
            print("SUCCESS: pgvector extension is enabled.")
        else:
            print("WARNING: pgvector extension is NOT enabled.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Verification Error: {e}")

if __name__ == "__main__":
    verify_tables()

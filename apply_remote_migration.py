import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

def apply_migration():
    db_url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {db_url.split('@')[1]}")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        migration_path = 'supabase/migrations/20240502000000_production_sync.sql'
        with open(migration_path, 'r') as f:
            sql = f.read()
            
        print("Applying migration...")
        cur.execute(sql)
        conn.commit()
        print("Migration applied successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    apply_migration()

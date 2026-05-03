import os
import json
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

load_dotenv()

def run_migration():
    db_url = os.getenv("DATABASE_URL")
    print(f"Using Pooler Connection Logic...")
    try:
        # Use SimpleConnectionPool like the app does
        connection_pool = psycopg2.pool.SimpleConnectionPool(1, 1, db_url)
        conn = connection_pool.getconn()
        cur = conn.cursor()
        
        with open('migrate_improvements.sql', 'r') as f:
            sql = f.read()
            
        print("Applying migrate_improvements.sql...")
        cur.execute(sql)
        conn.commit()
        print("Migration applied successfully!")
        
        cur.close()
        connection_pool.putconn(conn)
        connection_pool.closeall()
    except Exception as e:
        print(f"Migration Error: {e}")

if __name__ == "__main__":
    run_migration()

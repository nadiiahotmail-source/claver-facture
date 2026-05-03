import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def run_migration():
    db_url = os.getenv("DATABASE_URL")
    # On s'assure que l'URL est bien formée
    print(f"Attempting connection...")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        with open('migrate_improvements.sql', 'r') as f:
            sql = f.read()
            
        print("Applying migrate_improvements.sql...")
        cur.execute(sql)
        conn.commit()
        print("Migration applied successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Migration Error: {e}")

if __name__ == "__main__":
    run_migration()

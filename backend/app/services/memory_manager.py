import os
import google.generativeai as genai
from typing import List, Dict, Any
from app.services.db_service import DBService

class MemoryManager:
    def __init__(self):
        self.db = DBService()
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.embedding_model = "models/embedding-001"

    async def _get_embedding(self, text: str) -> List[float]:
        try:
            # Utilisation de embedding-001 (768 dims) pour Gemini
            result = genai.embed_content(
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Embedding error: {e}")
            return []

    async def store_context(self, user_id: str, reminder_data: Dict[str, Any]):
        """Stores a reminder context with its embedding in the database."""
        client_name = reminder_data.get("client_name")
        summary = f"Rappel de prime pour {reminder_data.get('insurer')} - Montant: {reminder_data.get('amount')}€ - Echéance: {reminder_data.get('due_date')}"
        
        embedding = await self._get_embedding(summary)
        
        conn = self.db._get_connection()
        if not conn: return
        try:
            cur = conn.cursor()
            query = """
                INSERT INTO memory_context (user_id, client_name, summary, metadata, embedding)
                VALUES (%s, %s, %s, %s, %s);
            """
            cur.execute(query, (user_id, client_name, summary, json.dumps(reminder_data), embedding))
            conn.commit()
            cur.close()
        except Exception as e:
            print(f"Error storing memory context: {e}")
        finally:
            self.db._release_connection(conn)

    async def search_context(self, user_id: str, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Searches for relevant context using Vector Cosine Similarity."""
        embedding = await self._get_embedding(query)
        if not embedding:
            return []

        conn = self.db._get_connection()
        if not conn: return []
        try:
            cur = conn.cursor()
            # Recherche par similarité cosinus (<=> en pgvector)
            cur.execute("""
                SELECT summary, created_at, 1 - (embedding <=> %s::vector) as similarity
                FROM memory_context 
                WHERE user_id = %s
                ORDER BY embedding <=> %s::vector ASC
                LIMIT %s;
            """, (embedding, user_id, embedding, limit))
            
            rows = cur.fetchall()
            cur.close()
            return [{"text": row[0], "date": row[1].strftime("%Y-%m-%d"), "similarity": float(row[2])} for row in rows]
        except Exception as e:
            print(f"Error searching memory context: {e}")
            return []
        finally:
            self.db._release_connection(conn)

import os
import google.generativeai as genai
from typing import List, Dict, Any

class MemoryManager:
    def __init__(self, db_path: str = "./data/lancedb"):
        # LanceDB disabled for Vercel size limits
        # We will use Gemini for embeddings and Supabase for storage in the next iteration
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.embedding_model = "models/embedding-001"

    async def _get_embedding(self, text: str) -> List[float]:
        try:
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Embedding error: {e}")
            return []

    async def store_context(self, user_id: str, reminder_data: Dict[str, Any]):
        """Stores a reminder context (Supabase integration pending)."""
        # For now, we skip vector storage to keep the bundle small
        pass

    async def search_context(self, user_id: str, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Searches for relevant context (Supabase integration pending)."""
        # For now, returns empty to avoid dependency on heavy libraries
        return []

import lancedb
import os
import pandas as pd
import google.generativeai as genai
from typing import List, Dict, Any

class MemoryManager:
    def __init__(self, db_path="./memory_lancedb"):
        self.db_path = db_path
        self.db = lancedb.connect(self.db_path)
        self.table_name = "dossier_context"
        
        # Configure Gemini for embeddings
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        self.embed_model = "models/text-embedding-004"

    def ensure_table(self):
        if self.table_name not in self.db.table_names():
            self.db.create_table(self.table_name, data=[
                {
                    "vector": [0.0] * 768, 
                    "text": "init", 
                    "user_id": "system",
                    "metadata": "{}"
                }
            ])

    def _get_embedding(self, text: str) -> List[float]:
        result = genai.embed_content(
            model=self.embed_model,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    async def store_context(self, text: str, user_id: str, metadata: Dict[str, Any] = None):
        table = self.db.open_table(self.table_name)
        vector = self._get_embedding(text)
        table.add([{
            "vector": vector,
            "text": text,
            "user_id": user_id,
            "metadata": str(metadata or {})
        }])

    async def search_context(self, query: str, user_id: str, limit: int = 3):
        table = self.db.open_table(self.table_name)
        query_vec = self._get_embedding(query)
        
        # Filter by user_id for multi-tenancy at memory level
        results = table.search(query_vec).where(f"user_id = '{user_id}'").limit(limit).to_pandas()
        return results

memory_manager = MemoryManager()

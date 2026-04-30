import os
import lancedb
import pandas as pd
import google.generativeai as genai
from typing import List, Dict, Any

class MemoryManager:
    def __init__(self, db_path: str = "./data/lancedb"):
        if not os.path.exists(db_path):
            os.makedirs(db_path, exist_ok=True)
        self.db = lancedb.connect(db_path)
        self.table_name = "reminders_context"
        
        # Configure Gemini Embeddings
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.embedding_model = "models/embedding-001"

    async def _get_embedding(self, text: str) -> List[float]:
        result = genai.embed_content(
            model=self.embedding_model,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    async def store_context(self, user_id: str, reminder_data: Dict[str, Any]):
        """Stores a reminder and its context in the vector store."""
        text_context = f"Client: {reminder_data.get('client_name')}, Insurer: {reminder_data.get('insurer')}, Policy: {reminder_data.get('policy_number')}"
        vector = await self._get_embedding(text_context)
        
        data = [{
            "vector": vector,
            "text": text_context,
            "user_id": user_id,
            "reminder_id": str(reminder_data.get('id')),
            "metadata": str(reminder_data)
        }]
        
        if self.table_name in self.db.table_names():
            table = self.db.open_table(self.table_name)
            table.add(data)
        else:
            self.db.create_table(self.table_name, data=data)

    async def search_context(self, user_id: str, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Searches for relevant context based on a query."""
        if self.table_name not in self.db.table_names():
            return []
            
        vector = await self._get_embedding(query)
        table = self.db.open_table(self.table_name)
        
        results = table.search(vector)\
            .where(f"user_id = '{user_id}'")\
            .limit(limit)\
            .to_list()
            
        return results

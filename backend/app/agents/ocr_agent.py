import os
import json
import google.generativeai as genai
from typing import Dict, Any, Optional

class OCRAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def parse_file(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Extracts structured data from an invoice/reminder.
        Multi-stage: 1. Extraction, 2. Self-verification.
        """
        try:
            mime_type = "application/pdf" if file_path.lower().endswith('.pdf') else "image/jpeg"
            
            with open(file_path, "rb") as f:
                file_bytes = f.read()

            # Stage 1: Extraction
            prompt = """
            Analyse ce document d'assurance. 
            Extrais : client_name, insurer, amount, due_date, policy_number, phone_number.
            Format JSON uniquement.
            """
            
            response = self.model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": file_bytes}
            ])
            
            data = self._clean_json(response.text)
            
            # Stage 2: Verification (Internal reasoning)
            verify_prompt = f"""
            Vérifie ces données extraites par rapport au document : {json.dumps(data)}
            Y a-t-il des erreurs ? Si oui, corrige-les. Sinon, renvoie le JSON tel quel.
            """
            
            final_response = self.model.generate_content([
                verify_prompt,
                {"mime_type": mime_type, "data": file_bytes}
            ])
            
            return self._clean_json(final_response.text)
            
        except Exception as e:
            print(f"OCR Agent Error: {e}")
            return None

    def _clean_json(self, text: str) -> Dict[str, Any]:
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)

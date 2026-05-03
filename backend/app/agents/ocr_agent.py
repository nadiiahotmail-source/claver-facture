import os
import json
import google.generativeai as genai
from typing import Dict, Any, Optional
from app.core.prompts import OCR_EXTRACTION_PROMPT

class OCRAgent:
    def __init__(self, api_key: Optional[str] = None):
        # Utilisation de Flash pour la rapidité sur Vercel (évite les timeouts)
        if api_key:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')

    async def parse_file(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Extracts structured data from an invoice/reminder.
        """
        try:
            mime_type = "application/pdf" if file_path.lower().endswith('.pdf') else "image/jpeg"
            
            with open(file_path, "rb") as f:
                file_bytes = f.read()

            prompt = """
            Analyse ce document de relance ou de prime d'assurance.
            Extrait les informations suivantes au format JSON :
            - client_name : nom du client
            - insurer : nom de la compagnie d'assurance (ex: AXA, AG, Baloise)
            - amount : montant total à payer (nombre uniquement)
            - due_date : date d'échéance (AAAA-MM-JJ)
            - invoice_number : numéro de facture ou contrat
            - iban : code IBAN pour le paiement
            - client_email : email du client si présent
            - client_phone : téléphone du client si présent
            
            Retourne UNIQUEMENT le bloc JSON.
            """
            
            response = self.model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": file_bytes}
            ])
            
            return self._clean_json(response.text)
            
        except Exception as e:
            print(f"OCR Agent Error: {e}")
            return None

    def _clean_json(self, text: str) -> Dict[str, Any]:
        try:
            # Extraction du bloc JSON si présent
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            return json.loads(text.strip())
        except Exception as e:
            print(f"JSON Cleaning Error: {e} | Raw: {text}")
            # Fallback simple
            return {}

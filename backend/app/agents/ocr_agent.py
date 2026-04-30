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

            # Stage 1: Extraction avec raisonnement
            prompt = """
            Tu es un expert en analyse de documents d'assurance. 
            Analyse cette facture ou ce rappel de prime.
            Extrais les informations suivantes :
            - client_name: Nom complet du client.
            - insurer: Nom de la compagnie d'assurance (ex: AXA, Allianz).
            - amount: Montant total à payer (nombre pur).
            - due_date: Date d'échéance (Format YYYY-MM-DD).
            - policy_number: Numéro de contrat/police.
            - phone_number: Numéro de téléphone du client si présent.
            - iban: IBAN pour le paiement si présent.
            - siret_bce: Numéro SIRET (France) ou BCE (Belgique) de l'assureur ou du courtier.

            Si une information est absente, mets "null".
            Format JSON uniquement.
            """
            
            response = self.model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": file_bytes}
            ])
            
            data = self._clean_json(response.text)
            
            # Stage 2: Vérification et Correction (Self-Reflexion)
            verify_prompt = f"""
            Voici les données que tu as extraites : {json.dumps(data)}
            Regarde à nouveau le document et vérifie particulièrement :
            1. Le montant (n'oublie pas les centimes).
            2. La date d'échéance (ne confonds pas avec la date d'émission).
            3. Le numéro de police (assure-toi qu'il est complet).

            Si tu trouves des erreurs, corrige-les et renvoie le JSON final corrigé.
            Si tout est parfait, renvoie exactement le même JSON.
            Format JSON uniquement.
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

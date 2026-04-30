import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class OCRAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def parse_pdf(self, file_path: str):
        """Extracts and structures data from a file (PDF or Image) via Multimodal AI."""
        try:
            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                return None

            mime_type = "application/pdf"
            if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                mime_type = "image/jpeg"

            with open(file_path, "rb") as f:
                file_bytes = f.read()

            prompt = """
            Analyse ce document (rappel de prime d'assurance ou facture).
            Extrais les informations suivantes au format JSON uniquement :
            - client_name : Nom complet du client/assuré
            - insurer : Nom de la compagnie d'assurance
            - amount : Montant total à payer (nombre pur, ex: 125.50)
            - due_date : Date d'échéance (format YYYY-MM-DD)
            - policy_number : Numéro de contrat ou de police (si présent)
            - phone_number : Numéro de téléphone du client (si présent, format international)

            Si une information est absente, mets null.
            Retourne UNIQUEMENT l'objet JSON, sans texte additionnel ni balises markdown.
            """

            response = self.model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": file_bytes}
            ])

            return self._clean_and_parse_json(response.text)
        except Exception as e:
            print(f"Error parsing file with Gemini: {e}")
            return None

    def _clean_and_parse_json(self, text: str):
        """Cleans AI response and parses it into a dictionary."""
        try:
            # Remove markdown code blocks if present
            clean_text = text.strip().replace("```json", "").replace("```", "")
            return json.loads(clean_text)
        except Exception as e:
            print(f"JSON Parsing Error: {e}")
            print(f"Raw response was: {text}")
            return None

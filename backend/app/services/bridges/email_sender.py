import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class EmailSender:
    def __init__(self):
        # Configure Gemini for email generation
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_draft(self, data: dict):
        """Génère un brouillon d'e-mail professionnel via IA."""
        client_name = data.get("client_name")
        amount = data.get("amount")
        due_date = data.get("due_date")
        insurer = data.get("insurer")
        policy_number = data.get("policy_number") or "N/A"

        prompt = f"""
        Rédige un e-mail de relance professionnel et élégant pour un courtier d'assurance.
        Destinataire : {client_name}
        Sujet : Prime d'assurance {insurer} - Échéance au {due_date}
        
        Détails :
        - Compagnie : {insurer}
        - Contrat n° : {policy_number}
        - Montant : {amount} €
        - Date limite : {due_date}

        Instructions :
        1. Le ton doit être courtois, professionnel et rassurant.
        2. Explique que le paiement n'a pas encore été reçu.
        3. Propose de l'aide si le client rencontre des difficultés.
        4. Inclus un sujet d'e-mail clair.
        5. Retourne le résultat sous forme de texte brut avec :
           SUBJECT: [Le sujet]
           BODY: [Le corps du mail]
        """
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            
            subject = "Rappel de prime"
            body = text
            
            if "SUBJECT:" in text and "BODY:" in text:
                parts = text.split("BODY:")
                subject = parts[0].replace("SUBJECT:", "").strip()
                body = parts[1].strip()
            
            return {"subject": subject, "body": body}
        except Exception as e:
            print(f"Error generating email draft: {e}")
            return {
                "subject": f"Rappel de prime : {insurer}",
                "body": f"Bonjour {client_name},\n\nSauf erreur de notre part, le paiement de votre prime {insurer} de {amount}€ n'est pas encore parvenu.\n\nCordialement."
            }

    async def send_email(self, recipient_email: str, subject: str, body: str):
        """Simule l'envoi d'un e-mail (SMTP structure)."""
        print(f"--- SIMULATION ENVOI E-MAIL ---")
        print(f"To: {recipient_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body[:100]}...")
        print(f"-------------------------------")
        return True

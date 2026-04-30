import google.generativeai as genai
from typing import Dict, Any

class CommAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def draft_reminder(self, reminder_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Drafts a reminder message based on the client context and urgency.
        """
        prompt = f"""
        Rédige un message de rappel d'assurance pour :
        Client: {reminder_data.get('client_name')}
        Assureur: {reminder_data.get('insurer')}
        Montant: {reminder_data.get('amount')}
        Échéance: {reminder_data.get('due_date')}
        
        Le ton doit être professionnel mais bienveillant. 
        Inclus un appel à l'action clair.
        Retourne : subject, body.
        """
        
        response = self.model.generate_content(prompt)
        # Simplified parsing for demo
        return {
            "subject": f"Rappel Prime d'Assurance - {reminder_data.get('insurer')}",
            "body": response.text
        }

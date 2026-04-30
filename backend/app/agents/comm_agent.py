import google.generativeai as genai
from typing import Dict, Any
from app.core.prompts import COMM_DRAFT_PROMPT

class CommAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def draft_reminder(self, reminder_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Drafts a reminder message based on the client context and urgency.
        """
        prompt = COMM_DRAFT_PROMPT.format(
            client_name=reminder_data.get('client_name'),
            insurer=reminder_data.get('insurer'),
            amount=reminder_data.get('amount'),
            due_date=reminder_data.get('due_date'),
            iban=reminder_data.get('iban', 'non spécifié')
        )
        
        response = self.model.generate_content(prompt)
        text = response.text
        
        # Parsing simple du format Subject/Body
        subject = "Rappel Prime d'Assurance"
        body = text
        
        if "Subject:" in text and "Body:" in text:
            parts = text.split("Body:")
            subject = parts[0].replace("Subject:", "").strip()
            body = parts[1].strip()
            
        return {
            "subject": subject,
            "body": body
        }

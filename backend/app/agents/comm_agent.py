import google.generativeai as genai
from typing import Dict, Any
from app.core.prompts import COMM_DRAFT_PROMPT
from app.services.bridges.email_sender import EmailSender
from app.services.bridges.whatsapp_bridge import WhatsAppDispatcher

class CommAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.email_bridge = EmailSender()
        self.whatsapp_bridge = WhatsAppDispatcher()

    async def draft_reminder(self, reminder_data: Dict[str, Any], past_context: List[Any] = []) -> Dict[str, str]:
        """
        Drafts a reminder message based on the client context, urgency, and past interactions.
        """
        context_str = "\n".join([str(c['text']) for c in past_context]) if past_context else "Aucun historique trouvé."
        
        prompt = COMM_DRAFT_PROMPT.format(
            client_name=reminder_data.get('client_name'),
            insurer=reminder_data.get('insurer'),
            amount=reminder_data.get('amount'),
            due_date=reminder_data.get('due_date'),
            iban=reminder_data.get('iban', 'non spécifié'),
            context=context_str
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

    async def send_email(self, recipient_email: str, subject: str, body: str):
        return await self.email_bridge.send_email(recipient_email, subject, body)

    async def send_whatsapp(self, phone: str, data: dict):
        return await self.whatsapp_bridge.dispatch(phone, data)

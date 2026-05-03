import google.generativeai as genai
from typing import Dict, Any, List, Optional
from app.core.prompts import COMM_DRAFT_PROMPT
from app.services.bridges.email_sender import EmailSender
from app.services.bridges.whatsapp_bridge import WhatsAppDispatcher

class CommAgent:
    def __init__(self, gemini_key: Optional[str] = None):
        # Gemini setup
        if gemini_key:
            genai.configure(api_key=gemini_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')
        self.email_bridge = EmailSender()
        self.whatsapp_bridge = WhatsAppDispatcher()

    async def draft_reminder(self, reminder_data: Dict[str, Any], past_context: List[Any] = [], tone: str = "courtois") -> Dict[str, str]:
        """
        Drafts a reminder message based on the client context, urgency, and past interactions.
        """
        from app.core.guardian import guardian
        
        # 1. Sanitize and Prepare context
        sanitized_context = "\n".join([guardian.sanitize_input(str(c['text'])) for c in past_context]) if past_context else "Aucun historique."
        
        # 2. Prepare the prompt using delimiters
        prompt = COMM_DRAFT_PROMPT.replace("[[client_name]]", guardian.sanitize_input(str(reminder_data.get('client_name')))) \
                                 .replace("[[insurer]]", guardian.sanitize_input(str(reminder_data.get('insurer')))) \
                                 .replace("[[amount]]", str(reminder_data.get('amount'))) \
                                 .replace("[[due_date]]", str(reminder_data.get('due_date'))) \
                                 .replace("[[iban]]", guardian.sanitize_input(str(reminder_data.get('iban', '')))) \
                                 .replace("[[context]]", sanitized_context) \
                                 .replace("[[tone]]", tone)
        
        # 3. Generate content
        response = self.model.generate_content(prompt)
        text = response.text
        
        # 4. Parsing Subject/Body
        subject = f"Rappel : Votre prime d'assurance {reminder_data.get('insurer')}"
        body = text
        
        if "Subject:" in text and "Body:" in text:
            parts = text.split("Body:")
            subject = parts[0].replace("Subject:", "").strip()
            body = parts[1].strip()
            
        return {
            "subject": subject,
            "body": body
        }

    async def send_email(self, recipient_email: str, subject: str, body: str, api_key: Optional[str] = None):
        return await self.email_bridge.send_email(recipient_email, subject, body, api_key)

    async def send_whatsapp(self, phone: str, data: dict, settings: dict = {}):
        return await self.whatsapp_bridge.dispatch(phone, data, settings)

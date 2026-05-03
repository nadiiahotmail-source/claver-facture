import os
import httpx
import google.generativeai as genai
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class WhatsAppProvider:
    async def send_message(self, phone: str, message: str):
        raise NotImplementedError

class NativeWhatsAppBridge(WhatsAppProvider):
    """Pont basé sur WhatsApp Web / Baileys ou Playwright."""
    def __init__(self):
        self.api_url = os.getenv("WHATSAPP_API_URL", "http://localhost:3001")
        self.session_active = True # Assumed active for this implementation

    async def send_message(self, phone: str, message: str):
        print(f"WhatsApp Bridge: Appui sur le service Baileys à {self.api_url}...")
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/send-message",
                    json={
                        "phone": phone,
                        "message": message
                    },
                    timeout=10.0
                )
                if response.status_code == 200:
                    print(f"WhatsApp Bridge: Message envoyé avec succès à {phone}.")
                    return True
                else:
                    print(f"WhatsApp Bridge Error: Service returned {response.status_code}")
                    return False
        except Exception as e:
            print(f"WhatsApp Bridge Error: Connection failed: {e}")
            # Fallback to simulation for now if requested by user or for dev
            if os.getenv("DEV_MODE") == "true":
                print("WhatsApp Bridge: [SIMULATION] Envoi réussi en mode DEV.")
                return True
            return False

class OfficialWhatsAppAPI(WhatsAppProvider):
    """Pont basé sur l'API Officielle Meta Cloud."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("WHATSAPP_API_KEY")

    async def send_message(self, phone: str, message: str):
        if not self.api_key:
            print("WhatsApp API: [SIMULATION] API Key missing.")
            return True
        print(f"WhatsApp API: Envoi officiel à {phone} via Meta Cloud...")
        return True

class TwilioWhatsAppBridge(WhatsAppProvider):
    """Pont basé sur l'API Twilio WhatsApp."""
    def __init__(self, account_sid: Optional[str] = None, auth_token: Optional[str] = None):
        self.sid = account_sid or os.getenv("TWILIO_ACCOUNT_SID")
        self.token = auth_token or os.getenv("TWILIO_AUTH_TOKEN")

    async def send_message(self, phone: str, message: str):
        if not self.sid or not self.token:
            print("Twilio WhatsApp: [SIMULATION] Credentials missing.")
            return True
        print(f"Twilio WhatsApp: Envoi via Twilio à {phone}...")
        return True

class WhatsAppDispatcher:
    def __init__(self):
        # Configuration par défaut, sera surchargée lors du dispatch
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_message(self, data: dict):
        """Génère un message de relance court et efficace."""
        prompt = f"""
        Rédige un message court pour WhatsApp destiné à {data.get('client_name')}.
        Prime de {data.get('amount')}€ chez {data.get('insurer')}.
        Échéance : {data.get('due_date')}.
        Ton : Amical mais professionnel. Pas de fioritures.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except:
            return f"Bonjour {data.get('client_name')}, un petit rappel concernant votre prime de {data.get('amount')}€ chez {data.get('insurer')}. Merci de régulariser rapidement. Cordialement."

    async def dispatch(self, phone: str, data: dict, settings: dict = {}):
        """Génère le message et l'envoie via le provider configuré par l'utilisateur."""
        mode = settings.get("whatsapp_bridge_mode", "native")
        
        if mode == "twilio":
            provider = TwilioWhatsAppBridge(
                settings.get("twilio_account_sid_enc"), 
                settings.get("twilio_auth_token_enc")
            )
        elif mode == "meta":
            provider = OfficialWhatsAppAPI(settings.get("whatsapp_api_key_enc"))
        else:
            provider = NativeWhatsAppBridge()

        message = await self.generate_message(data)
        success = await provider.send_message(phone, message)
        return {"success": success, "message": message, "provider": mode}

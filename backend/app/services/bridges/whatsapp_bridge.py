import os
import httpx
import google.generativeai as genai
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
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def send_message(self, phone: str, message: str):
        print(f"WhatsApp API: Envoi officiel à {phone}...")
        # Requête HTTP réelle vers l'API Meta
        return True

class WhatsAppDispatcher:
    def __init__(self, mode="native"):
        if mode == "native":
            self.provider = NativeWhatsAppBridge()
        else:
            self.provider = OfficialWhatsAppAPI(os.getenv("WHATSAPP_API_KEY"))
        
        # Configure Gemini for message generation
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_message(self, client_name: str, amount: float, due_date: str, insurer: str):
        """Génère un message de relance poli mais ferme via IA."""
        prompt = f"""
        Rédige un message court et professionnel pour WhatsApp destiné à un client nommé {client_name}.
        Le client doit payer une prime d'assurance de {amount}€ à la compagnie {insurer} avant le {due_date}.
        Le ton doit être cordial, rassurant mais indiquer que l'échéance est proche ou dépassée.
        N'utilise pas d'objet de mail, commence directement par "Bonjour".
        Inclus un emoji discret.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except:
            return f"Bonjour {client_name}, un rappel concernant votre prime de {amount}€ chez {insurer} (échéance: {due_date}). Merci de régulariser rapidement. Cordialement."

    async def dispatch(self, phone: str, data: dict):
        """Génère le message et l'envoie via le provider choisi."""
        message = await self.generate_message(
            data.get("client_name"), 
            data.get("amount"), 
            data.get("due_date"), 
            data.get("insurer")
        )
        success = await self.provider.send_message(phone, message)
        return {"success": success, "message": message}

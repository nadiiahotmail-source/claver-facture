import asyncio
import random
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class WhatsAppProvider:
    async def send_message(self, phone: str, message: str):
        raise NotImplementedError

class NativeWhatsAppBridge(WhatsAppProvider):
    """Pont basé sur WhatsApp Web / Baileys ou Playwright."""
    def __init__(self):
        self.session_active = False

    async def connect(self):
        """Simule une connexion par QR Code."""
        print("WhatsApp Bridge: Initialisation de la session Native...")
        await asyncio.sleep(1)
        self.session_active = True
        print("WhatsApp Bridge: Connecté.")

    async def send_message(self, phone: str, message: str):
        if not self.session_active:
            await self.connect()
        
        # Anti-spam: délai entre 1 et 3 secondes
        delay = random.uniform(1, 3)
        print(f"WhatsApp Bridge: Attente de {delay:.2f}s (anti-spam)...")
        await asyncio.sleep(delay)
        
        print(f"WhatsApp Bridge: ENVOI RÉEL à {phone} -> Message: {message[:50]}...")
        # Ici, on appellerait l'API locale du bridge (ex: via HTTP post à un service Baileys)
        return True

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

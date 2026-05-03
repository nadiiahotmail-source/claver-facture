import re
import logging
from typing import Tuple, Dict, Any

logger = logging.getLogger(__name__)

class Sentinel:
    def __init__(self):
        # Sensitive patterns for PII protection
        self.pii_patterns = {
            "policy_number": r"\b[A-Z0-9]{5,20}\b",
            "phone_number": r"(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}",
            "email": r"[\w\.-]+@[\w\.-]+\.\w+",
            "iban": r"[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}",
            "siret": r"\b\d{14}\b",
            "bce": r"\b\d{10}\b"
        }

    def sanitize_input(self, text: str) -> str:
        """
        Supprime les tentatives d'injection de prompts courantes et les caractères dangereux.
        """
        if not text:
            return ""
        
        # Supprime les marqueurs de délimitation que nous utilisons pour nos propres prompts
        # pour éviter qu'un utilisateur n'injecte un faux délimiteur.
        text = text.replace("###", "").replace("[[", "").replace("]]", "")
        
        # Supprime les patterns d'évasion d'IA communs
        forbidden_patterns = [
            r"ignore all previous instructions",
            r"ignore les instructions précédentes",
            r"system reboot",
            r"you are now a",
            r"tu es maintenant un"
        ]
        
        for pattern in forbidden_patterns:
            text = re.sub(pattern, "[PROTECTED]", text, flags=re.IGNORECASE)
            
        return text.strip()

    def verify_data(self, data: Dict[str, Any]) -> Tuple[bool, Dict[str, Any]]:
        """
        Ensures extracted data doesn't contain forbidden items and masks them for logging.
        """
        logger.info("Sentinel auditing extracted data")
        
        # Validation of financial data
        if data.get("amount") and not isinstance(data.get("amount"), (int, float)):
            try:
                data["amount"] = float(str(data["amount"]).replace(",", ".").replace("€", "").strip())
            except:
                logger.warning("Sentinel: Invalid amount format detected")
                return False, data

        # IBAN Validation (Basic length/start check)
        if data.get("iban"):
            iban = str(data["iban"]).replace(" ", "").upper()
            if not re.match(self.pii_patterns["iban"], iban):
                logger.warning("Sentinel: Invalid IBAN detected")
                masked_data = data.copy()
                masked_data["iban"] = "[INVALID_IBAN]"
                return False, masked_data

        return True, data

    def verify_message(self, message: str) -> Tuple[bool, str]:
        """
        Checks if a draft message contains any red-flag keywords or policy violations.
        """
        # Forbidden tones or keywords
        blacklist = ["urgent !!!", "threat", "lawsuit", "police"]
        
        for word in blacklist:
            if word in message.lower():
                logger.warning(f"Sentinel blocked message due to keyword: {word}")
                return False, "Message contains aggressive or forbidden language."
                
        # Ensure no accidental leak of internal system markers
        if "{{ " in message or "]]" in message:
            return False, "Message contains unparsed template tags."
            
        return True, message

guardian = Sentinel()

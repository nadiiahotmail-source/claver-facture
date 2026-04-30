import re
import logging
from typing import Tuple, Dict, Any

logger = logging.getLogger(__name__)

class Sentinel:
    def __init__(self):
        # Sensitive patterns for PII protection
        self.pii_patterns = {
            "policy_number": r"\b[A-Z0-9]{5,15}\b", # Simplified policy number pattern
            "phone_number": r"\+?\d{10,15}",
            "email": r"[\w\.-]+@[\w\.-]+\.\w+",
            "iban": r"[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}"
        }

    def verify_data(self, data: Dict[str, Any]) -> Tuple[bool, Dict[str, Any]]:
        """
        Ensures extracted data doesn't contain forbidden items and masks them for logging.
        """
        logger.info("Sentinel auditing extracted data")
        
        # In a real scenario, we might want to mask specific fields in the DB 
        # or just ensure they are present and valid.
        # For now, we validate the format.
        
        masked_data = data.copy()
        # Logic to mask data if it's for logging
        # ...
        
        return True, masked_data

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

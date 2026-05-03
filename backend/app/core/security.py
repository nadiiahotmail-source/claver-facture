import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

# La clé doit être une chaîne base64 de 32 octets. 
# Si elle n'existe pas, on en génère une (Attention: en production, elle doit être fixe !)
MASTER_KEY = os.getenv("ENCRYPTION_KEY")

if not MASTER_KEY:
    # Pour le premier lancement ou si oubliée, on génère une clé.
    # En production, il faut ABSOLUMENT définir ENCRYPTION_KEY dans le .env
    MASTER_KEY = Fernet.generate_key().decode()
    print("WARNING: ENCRYPTION_KEY not found in .env. Using a temporary key.")

cipher_suite = Fernet(MASTER_KEY.encode())

def encrypt_data(data: str) -> str:
    """Chiffre une chaîne de caractères."""
    if not data:
        return None
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    """Déchiffre une chaîne de caractères."""
    if not encrypted_data:
        return None
    try:
        return cipher_suite.decrypt(encrypted_data.encode()).decode()
    except Exception as e:
        print(f"Decryption Error: {e}")
        return None

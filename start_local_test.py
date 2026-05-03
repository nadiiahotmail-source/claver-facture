import subprocess
import os
import time
import sys

def check_command(cmd):
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except:
        return False

def start_servers():
    print("🚀 Préparation du lancement de KaziRelance (CLAVER Facture)...")
    
    # 1. Vérification Docker
    if not check_command(["docker", "ps"]):
        print("❌ Docker n'est pas lancé. Veuillez démarrer Docker Desktop.")
        return

    # 2. Lancement Backend
    print("📡 Démarrage du Backend (FastAPI)...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
        cwd="backend"
    )
    
    # 3. Lancement Frontend
    print("💻 Démarrage du Frontend (Next.js)...")
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd="frontend",
        shell=True
    )
    
    print("\n✅ Serveurs lancés !")
    print("🔗 Frontend : http://localhost:3000")
    print("🔗 Backend : http://localhost:8000")
    print("\nAppuyez sur Ctrl+C pour arrêter les serveurs.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Arrêt des serveurs...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    start_servers()

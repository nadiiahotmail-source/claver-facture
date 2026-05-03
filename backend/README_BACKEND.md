# KaziRelance Backend - Guide de Mise en Route

Ce répertoire contient le backend FastAPI pour le projet KaziRelance (gestion des impayés d'assurance en Belgique).

## 🚀 Installation

1. **Environnement Virtuel** :
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Variables d'environnement** (`backend/.env`) :
   ```env
   DATABASE_URL=votre_url_postgresql_directe
   SUPABASE_URL=votre_url_supabase
   SUPABASE_KEY=votre_cle_anom_ou_service_role
   GEMINI_API_KEY=votre_cle_google_ai
   RESEND_API_KEY=votre_cle_resend
   DEV_MODE=true  # Pour tester sans JWT réel si besoin
   ```

3. **Base de données** :
   Exécutez le contenu de `backend/init_db.sql` dans l'éditeur SQL de votre instance Supabase.

## 🛠 Lancement

```bash
python -m app.main
```
Le backend sera disponible sur `http://localhost:8000`.

## 📡 Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/upload` | OCR + Analyse IA d'un document. |
| GET | `/reminders` | Liste des dossiers de l'utilisateur. |
| POST | `/reminders/validate/{id}` | Validation humaine (approbation/rejet). |
| POST | `/reminders/dispatch/{id}` | Envoi de la relance (Email/WhatsApp). |
| GET | `/dashboard/stats` | KPIs de performance. |

## 🧪 Tests

Vous pouvez tester l'upload via `curl` :
```bash
curl -X POST "http://localhost:8000/upload" -H "Authorization: Bearer VOTRE_TOKEN" -F "file=@facture.pdf"
```

## 🔒 Sécurité

- Tous les endpoints sont protégés par JWT (Supabase).
- Isolation stricte par `user_id`.
- Chiffrement recommandé pour les clés API stockées dans la table `settings`.

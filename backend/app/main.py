from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import shutil
import os
from app.core.orchestrator import orchestrator
from app.services.db_service import DBService
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uuid

app = FastAPI(title="KaziRelance AI Agentic API")

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
db_service = DBService()

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Verifies the Supabase JWT token and returns the user ID."""
    if os.getenv("DEV_MODE") == "true":
        class MockUser:
            id = "00000000-0000-0000-0000-000000000000"
        return MockUser()
        
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication credentials missing")
        
    token = credentials.credentials
    try:
        # Verify token with Supabase
        response = db_service.supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

class InvoiceData(BaseModel):
    client_name: str
    insurer: str
    amount: float
    due_date: str
    policy_number: Optional[str] = None
    phone_number: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "KaziRelance AI Backend is Active"}

@app.get("/reminders")
async def get_reminders(user: any = Depends(get_current_user)):
    return db_service.get_all_reminders(user.id)

@app.post("/upload")
@limiter.limit("10/minute")
async def upload_invoice(request: Request, file: UploadFile = File(...), user: any = Depends(get_current_user)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.pdf', '.png', '.jpg', '.jpeg']:
        raise HTTPException(status_code=400, detail="Format non supporté")
    
    unique_id = uuid.uuid4()
    temp_path = f"temp_{unique_id}{ext}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Delegate to Orchestrator
        result = await orchestrator.process_upload(temp_path, user.id)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result["data"]
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/reminders/confirm")
async def confirm_reminder(data: InvoiceData, user: any = Depends(get_current_user)):
    result = db_service.save_reminder(data.dict(), user.id)
    if not result:
        raise HTTPException(status_code=500, detail="Erreur lors de la sauvegarde")
    return {"status": "success", "data": result}

@app.post("/reminders/draft/{reminder_id}")
async def generate_email_draft(reminder_id: str, user: any = Depends(get_current_user)):
    # The Orchestrator handles drafting and sentinel verification
    result = await orchestrator.handle_dispatch(reminder_id, user.id)
    if result["status"] == "error":
        raise HTTPException(status_code=403, detail=result["message"])
    return result

@app.post("/reminders/approve/{reminder_id}")
async def approve_email(reminder_id: str, user: any = Depends(get_current_user)):
    result = db_service.approve_email(reminder_id, user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Rappel non trouvé ou non autorisé")
    return {"status": "validated", "data": result}

@app.post("/reminders/dispatch/{reminder_id}")
async def dispatch_reminder(reminder_id: str, user: any = Depends(get_current_user)):
    # Logic for final dispatch through agent
    result = await orchestrator.handle_dispatch(reminder_id, user.id)
    return result

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

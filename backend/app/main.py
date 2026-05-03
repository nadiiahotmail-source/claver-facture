from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import shutil
import os
import uuid
from app.core.orchestrator import orchestrator
from app.services.db_service import DBService
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from types import SimpleNamespace


app = FastAPI(title="KaziRelance AI Agentic API")

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000"), "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
db_service = DBService()

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Verifies the Supabase JWT token and returns the user ID."""
    dev_mode = os.getenv("DEV_MODE", "false").lower() == "true"
    
    if not credentials:
        if dev_mode:
            return SimpleNamespace(id="00000000-0000-0000-0000-000000000000", email="dev@kazi.local")
        raise HTTPException(status_code=401, detail="Authentication credentials missing")
        
    token = credentials.credentials
    
    if dev_mode and token == "mock-token":
        return SimpleNamespace(id="00000000-0000-0000-0000-000000000000", email="dev@kazi.local")

    try:
        response = db_service.supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# --- Models ---

class ValidationRequest(BaseModel):
    approved: bool
    corrections: Optional[Dict[str, Any]] = None

class DispatchRequest(BaseModel):
    channel: str = "both" # "email", "whatsapp", "both"

class SettingsUpdate(BaseModel):
    gemini_api_key_enc: Optional[str] = None
    resend_api_key_enc: Optional[str] = None
    twilio_account_sid_enc: Optional[str] = None
    twilio_auth_token_enc: Optional[str] = None
    whatsapp_bridge_mode: str = "native"
    email_signature: Optional[str] = None
    communication_tone: str = "courtois"

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "KaziRelance AI Backend is Active"}

@app.get("/reminders")
async def get_reminders(status: Optional[str] = None, user: any = Depends(get_current_user)):
    return db_service.get_all_reminders(user.id, status)

@app.get("/reminders/{reminder_id}")
async def get_reminder(reminder_id: str, user: any = Depends(get_current_user)):
    reminder = db_service.get_reminder_by_id(reminder_id, user.id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder

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
        db_service.save_audit_log(user.id, "upload_started", {"filename": file.filename}, request.client.host)
        result = await orchestrator.process_upload(temp_path, user.id)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result["data"]
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/reminders/validate/{reminder_id}")
async def validate_reminder(reminder_id: str, data: ValidationRequest, user: any = Depends(get_current_user)):
    status = "validated" if data.approved else "rejected"
    updates = {"status": status, "is_validated": data.approved}
    if data.corrections:
        updates["human_corrections"] = data.corrections
        # Apply corrections to the main fields if they exist
        for k, v in data.corrections.items():
            if k in ["client_name", "amount", "due_date", "client_email", "client_phone"]:
                updates[k] = v

    result = db_service.update_reminder(reminder_id, user.id, updates)
    if not result:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    db_service.save_audit_log(user.id, f"reminder_{status}", {"id": reminder_id})
    return {"status": "success", "data": result}

# Alias for frontend backward compatibility
@app.post("/reminders/approve/{reminder_id}")
async def approve_reminder_alias(reminder_id: str, user: any = Depends(get_current_user)):
    return await validate_reminder(reminder_id, ValidationRequest(approved=True), user)

@app.post("/reminders/draft/{reminder_id}")
async def generate_email_draft(reminder_id: str, user: any = Depends(get_current_user)):
    result = await orchestrator.handle_draft(reminder_id, user.id)
    if result["status"] == "error":
        raise HTTPException(status_code=403, detail=result["message"])
    return result

@app.post("/reminders/dispatch/{reminder_id}")
@limiter.limit("5/minute")
async def dispatch_reminder(request: Request, reminder_id: str, data: Optional[DispatchRequest] = None, user: any = Depends(get_current_user)):
    # data can be null if frontend doesn't send body
    channel = data.channel if data else "both"
    result = await orchestrator.handle_send(reminder_id, user.id, channel)
    db_service.save_audit_log(user.id, "reminder_dispatched", {"id": reminder_id, "channel": channel})
    return result

@app.get("/dashboard/stats")
async def get_dashboard_stats(user: any = Depends(get_current_user)):
    return db_service.get_stats(user.id)

# Alias for frontend
@app.get("/stats")
async def get_stats_alias(user: any = Depends(get_current_user)):
    return await get_dashboard_stats(user)

@app.get("/settings")
async def get_settings(user: any = Depends(get_current_user)):
    return db_service.get_settings(user.id)

@app.post("/settings")
@limiter.limit("3/minute")
async def save_settings(request: Request, data: SettingsUpdate, user: any = Depends(get_current_user)):
    result = db_service.save_settings(user.id, data.dict(exclude_unset=True))
    if not result:
        raise HTTPException(status_code=500, detail="Failed to save settings")
    return result

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

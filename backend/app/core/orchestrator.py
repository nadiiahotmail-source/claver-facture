import asyncio
import logging
import os
from typing import Dict, Any, List, Optional
from app.services.db_service import DBService
from app.agents.ocr_agent import OCRAgent
from app.agents.comm_agent import CommAgent
from app.core.guardian import Sentinel
from app.services.memory_manager import MemoryManager

logger = logging.getLogger(__name__)

class Orchestrator:
    def __init__(self):
        self.db = DBService()
        self.sentinel = Sentinel()
        self.memory = MemoryManager()
        
    async def process_upload(self, file_path: str, user_id: str) -> Dict[str, Any]:
        """
        Flow: Storage Upload -> OCR -> Sentinel Audit -> Persistence
        """
        # 0. Upload to Storage for future preview
        from app.services.storage_service import storage_service
        file_url = await storage_service.upload_file(file_path, user_id)

        # 1. OCR Extraction (Using user-specific settings)
        settings = self.db.get_settings(user_id)
        ocr = OCRAgent(api_key=settings.get("gemini_api_key_enc"))
        raw_data = await ocr.parse_file(file_path)
        if not raw_data:
            return {"status": "error", "message": "OCR extraction failed"}
            
        # 2. Sentinel Check (Validation & Safety)
        is_safe, validated_data = self.sentinel.verify_data(raw_data)
        
        # 3. Preparation for Persistence
        reminder_payload = {
            "client_name": validated_data.get("client_name"),
            "client_email": validated_data.get("client_email"),
            "client_phone": validated_data.get("client_phone"),
            "invoice_number": validated_data.get("invoice_number"),
            "insurer": validated_data.get("insurer"),
            "iban": validated_data.get("iban"),
            "amount": validated_data.get("amount"),
            "due_date": validated_data.get("due_date"),
            "status": "pending_validation" if is_safe else "security_flagged",
            "ocr_data": raw_data,
            "file_url": file_url
        }

        # 4. Persistence in Supabase
        saved_reminder = self.db.create_reminder(reminder_payload, user_id)
        
        if not saved_reminder:
            return {"status": "error", "message": "Failed to save to database"}

        # 5. Agentic Memory Storage (Async)
        if is_safe:
            asyncio.create_task(self.memory.store_context(user_id, saved_reminder))
            
        return {
            "status": "success",
            "data": saved_reminder,
            "verification_status": "sentinel_verified" if is_safe else "sentinel_flagged"
        }

    async def handle_draft(self, reminder_id: str, user_id: str) -> Dict[str, Any]:
        """
        Flow: Retrieve -> Draft -> Sentinel Check -> Update State
        """
        # 1. Retrieve the reminder
        reminder = self.db.get_reminder_by_id(reminder_id, user_id)
        if not reminder:
            return {"status": "error", "message": "Unauthorized or not found"}
            
        # 2. Get User Settings for the agent
        settings = self.db.get_settings(user_id)
        
        # 3. Memory Retrieval (Context-awareness)
        past_context = await self.memory.search_context(user_id, reminder["client_name"])
        
        # 4. Contextual drafting
        comm = CommAgent(gemini_key=settings.get("gemini_api_key_enc"))
        draft = await comm.draft_reminder(reminder, past_context, settings.get("communication_tone"))
        
        # 5. Sentinel validation of the draft
        is_safe, final_body = self.sentinel.verify_message(draft["body"])
        if not is_safe:
            self.db.update_reminder(reminder_id, user_id, {"status": "blocked_by_sentinel"})
            return {"status": "error", "message": f"Message blocked by Guardian: {final_body}"}
            
        # 6. Update reminder with draft
        updated_reminder = self.db.update_reminder(
            reminder_id, 
            user_id,
            {
                "email_subject": draft["subject"], 
                "email_body": final_body, 
                "status": "drafted"
            }
        )
        
        return {
            "status": "drafted", 
            "reminder_id": reminder_id, 
            "data": updated_reminder
        }

    async def handle_send(self, reminder_id: str, user_id: str, channel: str = "both") -> Dict[str, Any]:
        """
        Flow: Retrieve -> Verify -> Real Dispatch (Email + WhatsApp)
        """
        # 1. Retrieve the validated draft
        reminder = self.db.get_reminder_by_id(reminder_id, user_id)
        if not reminder or not reminder.get("is_validated"):
            return {"status": "error", "message": "Reminder not validated or not found"}

        # 2. Get User Settings (API Keys)
        settings = self.db.get_settings(user_id)
        
        results = {}
        
        # 3. Dispatch
        comm = CommAgent(gemini_key=settings.get("gemini_api_key_enc"))
        
        if channel in ["email", "both"] and reminder.get("client_email"):
            results["email"] = await comm.send_email(
                reminder["client_email"], 
                reminder["email_subject"], 
                reminder["email_body"],
                settings.get("resend_api_key_enc")
            )
            
        if channel in ["whatsapp", "both"] and reminder.get("client_phone"):
            results["whatsapp"] = await comm.send_whatsapp(
                reminder["client_phone"], 
                reminder,
                settings
            )
            
        # 4. Final state update
        self.db.update_reminder(reminder_id, user_id, {
            "status": "sent",
            "email_sent_at": "NOW()" # This is a placeholder, DBService handles timestamp or we can use string
        })
        
        return {
            "status": "sent",
            "results": results
        }

orchestrator = Orchestrator()

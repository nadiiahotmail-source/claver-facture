import asyncio
import logging
from typing import Dict, Any, List
from app.services.db_service import DBService
from app.agents.ocr_agent import OCRAgent
from app.agents.comm_agent import CommAgent
from app.core.guardian import Sentinel
from app.services.memory_manager import MemoryManager

logger = logging.getLogger(__name__)

class Orchestrator:
    def __init__(self):
        self.db = DBService()
        self.ocr = OCRAgent()
        self.comm = CommAgent()
        self.sentinel = Sentinel()
        self.memory = MemoryManager()
        
    async def process_upload(self, file_path: str, user_id: str) -> Dict[str, Any]:
        """
        Flow: OCR -> Sentinel Audit -> Persistence
        """
        logger.info(f"Orchestrating upload for user {user_id}")
        
        # 1. OCR Extraction
        raw_data = await self.ocr.parse_file(file_path)
        if not raw_data:
            return {"status": "error", "message": "OCR extraction failed"}
            
        # 2. Sentinel Check (Validation & Safety)
        is_safe, validated_data = self.sentinel.verify_data(raw_data)
        
        # 3. Persistence in Supabase
        validated_data["status"] = "pending_validation" if is_safe else "security_flagged"
        saved_reminder = self.db.save_reminder(validated_data, user_id)
        
        if not saved_reminder:
            return {"status": "error", "message": "Failed to save to database"}

        # 4. Agentic Memory Storage
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
        logger.info(f"Generating draft for reminder {reminder_id}")
        
        # 1. Multi-tenant retrieval
        reminder = self.db.get_reminder_safe(reminder_id, user_id)
        if not reminder:
            return {"status": "error", "message": "Unauthorized or not found"}
            
        # 2. Memory Retrieval (Context-awareness)
        past_context = await self.memory.search_context(user_id, reminder["client_name"])
        
        # 3. Contextual drafting
        draft = await self.comm.draft_reminder(reminder, past_context)
        
        # 3. Sentinel validation of the draft
        is_safe, final_body = self.sentinel.verify_message(draft["body"])
        if not is_safe:
            self.db.update_status(reminder_id, "blocked_by_sentinel", user_id)
            return {"status": "error", "message": f"Message blocked by Guardian: {final_body}"}
            
        # 4. Update reminder with draft
        updated_reminder = self.db.update_email_draft(
            reminder_id, 
            draft["subject"], 
            final_body, 
            user_id
        )
        
        return {
            "status": "drafted", 
            "reminder_id": reminder_id, 
            "data": updated_reminder
        }

    async def handle_send(self, reminder_id: str, user_id: str) -> Dict[str, Any]:
        """
        Flow: Retrieve -> Verify -> Real Dispatch (Email + WhatsApp)
        """
        logger.info(f"Finalizing dispatch for reminder {reminder_id}")
        
        # 1. Retrieve the validated draft
        reminder = self.db.get_reminder_safe(reminder_id, user_id)
        if not reminder or not reminder.get("is_validated"):
            return {"status": "error", "message": "Reminder not validated or not found"}

        # 2. Parallel dispatch (Email + WhatsApp)
        # Note: In production, we might want to check user preferences first
        
        results = {}
        
        # Email Dispatch (if email present)
        if reminder.get("client_email"):
            results["email"] = await self.comm.send_email(
                reminder["client_email"], 
                reminder["email_subject"], 
                reminder["email_body"]
            )
            
        # WhatsApp Dispatch (if phone present)
        if reminder.get("phone_number"):
            results["whatsapp"] = await self.comm.send_whatsapp(
                reminder["phone_number"], 
                reminder
            )
            
        # 3. Final state update
        self.db.mark_email_sent(reminder_id, user_id)
        
        return {
            "status": "sent",
            "results": results
        }

orchestrator = Orchestrator()

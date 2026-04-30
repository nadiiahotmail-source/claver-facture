import imaplib
import email
import os
from email.header import decode_header
from app.services.ocr_service import OCRAgent
from dotenv import load_dotenv

load_dotenv()

class EmailBridge:
    def __init__(self):
        self.host = os.getenv("IMAP_HOST")
        self.user = os.getenv("IMAP_USER")
        self.password = os.getenv("IMAP_PASSWORD")
        self.ocr_agent = OCRAgent()

    async def check_emails(self):
        """Checks the mailbox for new invoices."""
        if not self.host or not self.user:
            print("Email Bridge: Configuration missing.")
            return []

        try:
            # Connect to the server
            mail = imaplib.IMAP4_SSL(self.host)
            mail.login(self.user, self.password)
            mail.select("inbox")

            # Search for unseen emails
            status, messages = mail.search(None, 'UNSEEN')
            processed_data = []

            for num in messages[0].split():
                status, data = mail.fetch(num, '(RFC822)')
                for response_part in data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8")
                        
                        print(f"Checking email: {subject}")

                        # Look for PDF attachments
                        for part in msg.walk():
                            if part.get_content_maintype() == 'multipart':
                                continue
                            if part.get('Content-Disposition') is None:
                                continue
                            
                            filename = part.get_filename()
                            if filename and filename.endswith('.pdf'):
                                # Save temporary file
                                temp_path = f"bridge_{filename}"
                                with open(temp_path, "wb") as f:
                                    f.write(part.get_payload(decode=True))
                                
                                # Process with IA
                                data = await self.ocr_agent.parse_pdf(temp_path)
                                if data:
                                    processed_data.append(data)
                                
                                # Cleanup
                                os.remove(temp_path)

            mail.close()
            mail.logout()
            return processed_data

        except Exception as e:
            print(f"Email Bridge Error: {e}")
            return []

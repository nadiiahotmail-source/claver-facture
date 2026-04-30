import asyncio
import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.ocr_service import OCRAgent
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

async def test_ocr():
    agent = OCRAgent()
    file_path = r"C:\Users\Devops\test facture\facture_001_techova_cafe.pdf"
    
    print(f"Testing OCR on: {file_path}")
    if not os.path.exists(file_path):
        print("Error: File not found!")
        return

    result = await agent.parse_pdf(file_path)
    print("OCR Result:")
    print(result)

if __name__ == "__main__":
    asyncio.run(test_ocr())

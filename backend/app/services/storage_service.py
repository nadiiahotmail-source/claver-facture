import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class StorageService:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(url, key)
        self.bucket_name = "invoices"

    async def upload_file(self, file_path: str, user_id: str) -> str:
        """
        Uploads a file to Supabase Storage and returns the public URL.
        """
        try:
            file_name = os.path.basename(file_path)
            # Create a unique path per user
            storage_path = f"{user_id}/{file_name}"
            
            with open(file_path, 'rb') as f:
                # Upsert to allow re-uploads
                self.supabase.storage.from_(self.bucket_name).upload(
                    path=storage_path,
                    file=f,
                    file_options={"x-upsert": "true"}
                )
            
            # Get Public URL
            res = self.supabase.storage.from_(self.bucket_name).get_public_url(storage_path)
            return res
        except Exception as e:
            print(f"Storage Upload Error: {e}")
            # Fallback for dev: return a local relative path as "URL"
            return f"/temp_files/{os.path.basename(file_path)}"

storage_service = StorageService()

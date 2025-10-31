from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload

SERVICE_ACCOUNT_FILE = 'service.json'
SCOPES = ['https://www.googleapis.com/auth/drive']
FOLDER_ID = 'YOUR_SHARED_DRIVE_FOLDER_ID'
FILE_PATH = 'random.mp4'
UPLOAD_NAME = 'Demonstration.mp4'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build('drive', 'v3', credentials=credentials)

file_metadata = {
    'name': UPLOAD_NAME,
    'parents': [FOLDER_ID]
}
media = MediaFileUpload(FILE_PATH, resumable=True)

file = service.files().create(
    body=file_metadata,
    media_body=media,
    fields='id'
).execute()

print(f'Uploaded File ID: {file.get("id")}')

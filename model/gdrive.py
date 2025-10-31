# gdrive_auto.py
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
import json

# ----------------------------
# Settings
# ----------------------------
CREDENTIALS_FILE = 'token.json'  # saved credentials after first login
FOLDER_ID = '17gmhVFM8dMjyVByrM6OH33oPW9-V8H4h'
FILE_PATH = 'random.mp4'
UPLOAD_NAME = 'Demonstration.mp4'

# ----------------------------
# Authenticate & Build Service
# ----------------------------
def authenticate():
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"{CREDENTIALS_FILE} not found! Run initial OAuth login first.")
        exit()
    
    creds = None
    with open(CREDENTIALS_FILE, 'r') as token_file:
        creds_data = json.load(token_file)
        creds = Credentials.from_authorized_user_info(creds_data, scopes=['https://www.googleapis.com/auth/drive.file'])
    service = build('drive', 'v3', credentials=creds)
    return service

# ----------------------------
# Upload file
# ----------------------------
def upload_file(service, file_path, folder_id, upload_name):
    file_metadata = {
        'name': upload_name,
        'parents': [folder_id]
    }
    media = MediaFileUpload(file_path, resumable=True)
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()
    print(f'Uploaded File ID: {file.get("id")}')

# ----------------------------
# Run
# ----------------------------
if __name__ == '__main__':
    if not os.path.exists(FILE_PATH):
        print(f"{FILE_PATH} does not exist!")
        exit()

    service = authenticate()
    upload_file(service, FILE_PATH, FOLDER_ID, UPLOAD_NAME)

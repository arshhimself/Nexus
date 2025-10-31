# initial_oauth.py
from google_auth_oauthlib.flow import InstalledAppFlow
import json

SCOPES = ['https://www.googleapis.com/auth/drive.file']
CREDENTIALS_FILE = 'client.json'

flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
creds = flow.run_local_server(port=0)

# Save the token for future automated use
with open('token.json', 'w') as f:
    f.write(creds.to_json())

print("token.json created! Now automated script can run without browser.")

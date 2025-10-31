import boto3
from botocore.exceptions import NoCredentialsError
import os 
from dotenv import load_dotenv
load_dotenv()

# AWS credentials
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')
REGION_NAME = 'ap-south-1' 

# # File to upload
# FILE_NAME = '../random.mp4'   # local file path
# S3_FILE_NAME = 'fareed.mp4'  # file name in S3

def upload_to_s3(file_obj, s3_file_name):
    s3 = boto3.client(
        's3',
        region_name=REGION_NAME,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    try:
        # file_obj = file.file from FastAPI UploadFile
        s3.upload_fileobj(file_obj, BUCKET_NAME, s3_file_name)
        return True
    except NoCredentialsError:
        return False


if __name__ == "__main__":
    # upload_to_s3(FILE_NAME, S3_FILE_NAME)
    upload_to_s3('../random.mp4', 'fareed1.mp4')


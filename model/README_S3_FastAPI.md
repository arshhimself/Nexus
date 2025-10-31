# FastAPI S3 File Upload

Ye FastAPI project aapko allow karta hai ki aap **file upload kar ke AWS S3 bucket me store kar sakein**, aur optional S3 me filename bhi set kar sakein.

---

## Requirements

1. Python 3.9+  
2. Install dependencies:

```bash
pip install fastapi uvicorn boto3 python-dotenv
```

3. `.env` file me AWS credentials set karein:

```dotenv
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_S3_BUCKET_NAME=your-bucket-name
```

---

## Running the API

```bash
uvicorn main:app --reload
```

FastAPI server default `http://127.0.0.1:8000` par chalega.

---

## API Endpoint

### **POST /upload/s3/**

- **Description:** Upload a file to S3. Optionally specify the filename in S3.
- **Content Type:** `multipart/form-data`
- **Form Fields:**
  - `file` → Actual file to upload (required)
  - `s3_file_name` → Custom filename for S3 (optional)

---

### Example Postman Setup

1. Open **Postman** → New Request → `POST http://127.0.0.1:8000/upload/s3/`
2. **Body tab** → Select `form-data`
3. Add fields:
   - Key: `file` → Type: `File` → Choose your file  
   - Key: `s3_file_name` → Type: `Text` → `custom_name.mp4` (optional)
4. Click **Send**.

---

### Example Response

```json
{
    "message": "File 'random.mp4' uploaded successfully to S3",
    "s3_file_name": "custom_name.mp4"
}
```

- `message` → Original file name  
- `s3_file_name` → File name in S3 (custom if provided, otherwise default filename)

---

### Notes

- Ensure your AWS credentials have **S3 write permissions** for the specified bucket.  
- If you omit `s3_file_name`, the original filename will be used in S3.  
- For large files, consider enabling **multipart upload** for better performance.

---
## Developer for this feature is 
Name - Fareed Sayed 
Email - fareedsayed95@gmail.com
Developer Message - Feel free to reach out

import sys
import os
import io
from werkzeug.datastructures import FileStorage

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.ocr_engine import EnhancedOCREngine

# Path to one known good image
IMG_PATH = r"C:/Users/PRATIK SAWANT/.gemini/antigravity/brain/23adbae0-73a7-4a24-8f7e-61c387b0ab3e/uploaded_image_0_1764836094194.png"

def test_filestorage():
    print(f"Testing with FileStorage mock on: {os.path.basename(IMG_PATH)}")
    
    if not os.path.exists(IMG_PATH):
        print("Image not found.")
        return

    # Read image bytes
    with open(IMG_PATH, 'rb') as f:
        img_bytes = f.read()
    
    # Create FileStorage mock
    file_storage = FileStorage(
        stream=io.BytesIO(img_bytes),
        filename=os.path.basename(IMG_PATH),
        content_type='image/png'
    )
    
    ocr = EnhancedOCREngine()
    
    try:
        # Simulate app.py behavior
        file_storage.seek(0)
        transactions = ocr.extract_transactions(file_storage)
        
        if transactions:
            print("✅ Success! Extracted:")
            print(transactions)
        else:
            print("❌ Failed to extract transactions.")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_filestorage()

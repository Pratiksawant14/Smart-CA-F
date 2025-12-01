
import sys
import os

# Add the current directory to path so we can import ocr_engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ocr_engine import EnhancedOCREngine
from PIL import Image

def test_ocr(image_path):
    engine = EnhancedOCREngine()
    
    print(f"Testing OCR on: {image_path}")
    
    try:
        with open(image_path, 'rb') as f:
            # We need to pass a file-like object that has .read()
            # The engine expects a file object, not a path
            transactions = engine.extract_transactions(f)
            
            print("\n--- Results ---")
            for t in transactions:
                print(t)
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Path to the uploaded image
    img_path = r"C:/Users/PRATIK SAWANT/.gemini/antigravity/brain/6b5fc488-8906-4f91-8e39-f54814a9b314/uploaded_image_1763923498623.png"
    test_ocr(img_path)

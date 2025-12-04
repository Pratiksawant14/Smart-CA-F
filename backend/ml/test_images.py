import sys
import os
import joblib
import pandas as pd

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.ocr_engine import EnhancedOCREngine

# Paths to images
IMAGE_PATHS = [
    r"C:/Users/PRATIK SAWANT/.gemini/antigravity/brain/23adbae0-73a7-4a24-8f7e-61c387b0ab3e/uploaded_image_0_1764836094194.png",
    r"C:/Users/PRATIK SAWANT/.gemini/antigravity/brain/23adbae0-73a7-4a24-8f7e-61c387b0ab3e/uploaded_image_1_1764836094194.png",
    r"C:/Users/PRATIK SAWANT/.gemini/antigravity/brain/23adbae0-73a7-4a24-8f7e-61c387b0ab3e/uploaded_image_2_1764836094194.png"
]

# Load Model
# Standardized path: backend/transaction_categorizer.joblib
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
MODEL_PATH = os.path.join(backend_dir, 'transaction_categorizer.joblib')

try:
    ml_model = joblib.load(MODEL_PATH)
    print(f"Model loaded from: {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    ml_model = None

def categorize_transaction(description, transaction_type='expense'):
    if ml_model is None:
        return "Uncategorized"
    
    try:
        category = ml_model.predict([description])[0]
        
        # Logic from app.py
        if category == "Income" and transaction_type == 'expense':
            expense_keywords = {
                'food': 'Food',
                'transport': 'Transport',
                'uber': 'Transport',
                'ola': 'Transport',
                'office': 'Office Supplies',
                'software': 'Software',
                'internet': 'Utilities',
                'electricity': 'Utilities'
            }
            desc_lower = description.lower()
            for keyword, cat in expense_keywords.items():
                if keyword in desc_lower:
                    return cat
            return "Uncategorized"
        return category
    except Exception as e:
        return f"Error: {e}"

def test_images():
    ocr = EnhancedOCREngine()
    
    with open('test_results.log', 'w', encoding='utf-8') as log_file:
        def log(msg):
            print(msg)
            log_file.write(msg + '\n')

        for i, img_path in enumerate(IMAGE_PATHS):
            log(f"\n{'='*40}")
            log(f"Testing Image {i+1}: {os.path.basename(img_path)}")
            log(f"{'='*40}")
            
            if not os.path.exists(img_path):
                log(f"File not found: {img_path}")
                continue
                
            try:
                with open(img_path, 'rb') as f:
                    transactions = ocr.extract_transactions(f)
                    
                if not transactions:
                    log(" [X] No transactions extracted.")
                    # Debug: Try extracting raw text to see what happened
                    with open(img_path, 'rb') as f:
                        text = ocr.extract_text(f)
                        log(f"DEBUG Raw Text:\n{text[:200]}...")
                else:
                    for t in transactions:
                        log(f" [OK] Extracted:")
                        log(f"  - Description: {t['description']}")
                        log(f"  - Amount: {t['amount']}")
                        log(f"  - Date: {t['date']}")
                        log(f"  - Type: {t['type']}")
                        
                        cat = categorize_transaction(t['description'], t['type'])
                        log(f" [CAT] Predicted Category: {cat}")
                        
            except Exception as e:
                log(f" [ERR] Error processing image: {e}")

if __name__ == "__main__":
    test_images()

import joblib
import re
import pytesseract
from PIL import Image
import os

# ==========================================
# CONFIGURATION
# ==========================================
# IF YOU ARE ON WINDOWS, UNCOMMENT THE LINE BELOW AND CHECK THE PATH:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def clean_ocr_text(text):
    """
    Cleans raw OCR text to make it look like our training data.
    """
    # 1. Lowercase everything
    text = text.lower()
    
    # 2. Remove specific "noise" words that appear in headers but aren't helpful
    noise_words = [
        'invoice', 'bill', 'date', 'total', 'subtotal', 'amount', 'id', 
        'order', 'receipt', 'payment', 'tax', 'gst', 'shipping', 'price', 
        'qty', 'rate', 'thank', 'you', 'visit', 'again'
    ]
    for word in noise_words:
        text = re.sub(r'\b' + word + r'\b', '', text)

    # 3. Remove numbers and special characters (keep only letters and spaces)
    # This helps remove prices (350.00) and dates (15/11/2024)
    text = re.sub(r'[^a-z\s]', ' ', text)
    
    # 4. Remove extra spaces
    text = ' '.join(text.split())
    
    return text

def predict_category(image_path):
    # 1. Load Model
    if not os.path.exists('transaction_categorizer.joblib'):
        print("ERROR: Model file not found. Run train_model.py first.")
        return

    model = joblib.load('transaction_categorizer.joblib')

    # 2. Perform OCR (Extract Text)
    print(f"\nProcessing Image: {image_path}")
    try:
        image = Image.open(image_path)
        raw_text = pytesseract.image_to_string(image)
    except Exception as e:
        print(f"Error reading image: {e}")
        return

    # 3. Clean the Text
    cleaned_text = clean_ocr_text(raw_text)
    print(f"Extracted Keywords: '{cleaned_text}'")

    # 4. Predict
    if cleaned_text.strip() == "":
        print("Could not extract enough text to predict.")
    else:
        prediction = model.predict([cleaned_text])[0]
        print(f"PREDICTED CATEGORY:  👉  {prediction.upper()}")
        print("-" * 30)

if __name__ == '__main__':
    # LIST YOUR IMAGE FILE NAMES HERE
    my_images = [
        'Screenshot 2025-11-15 020115.png',  # Amazon
        'Screenshot 2025-11-15 020121.png',  # Adobe
        'Screenshot 2025-11-15 015437.png',  # Zomato
        'Screenshot 2025-11-15 020049.png'   # Uber
    ]

    for img in my_images:
        if os.path.exists(img):
            predict_category(img)
        else:
            print(f"Image not found: {img}")
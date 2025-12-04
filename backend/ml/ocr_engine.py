"""
Enhanced OCR Engine for Smart CA
Handles receipts, bills, bank statements, and email screenshots
with intelligent amount extraction and categorization.
"""

import re
from datetime import datetime
from typing import List, Dict, Optional
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import io

class EnhancedOCREngine:
    """
    Advanced OCR engine with intelligent transaction extraction.
    """
    
    def __init__(self):
        # Keywords that indicate total amount (most important)
        self.total_keywords = [
            'total', 'grand total', 'net amount', 'amount due', 'amount payable',
            'bill amount', 'final amount', 'total amount', 'total payable',
            'you paid', 'paid amount', 'payment', 'balance', 'net total',
            'amount paid', 'total paid', 'invoice total', 'order total',
            'subtotal', 'sub total', 'charged', 'debit', 'credit',
            'transferred', 'received', 'deposited', 'withdrawn'
        ]
        
        # Keywords to ignore (these are NOT the main transaction)
        self.ignore_keywords = [
            'cgst', 'sgst', 'igst', 'gst', 'tax', 'vat', 'service charge',
            'delivery charge', 'discount', 'offer', 'saved', 'savings',
            'tip', 'cashback', 'wallet', 'points', 'rewards',
            'packing charge', 'convenience fee', 'handling charge',
            'item', 'qty', 'quantity', 'price', 'rate', 'mrp',
            'phone', 'mobile', 'email', 'address', 'pincode', 'gstin'
        ]
        
        # Date formats to recognize
        self.date_patterns = [
            r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',  # DD/MM/YYYY or DD-MM-YYYY
            r'\d{4}[/-]\d{1,2}[/-]\d{1,2}',    # YYYY-MM-DD
            r'\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}',  # DD Mon YYYY
            r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}'   # Mon DD, YYYY
        ]
        
        # Amount patterns (₹, Rs, INR, etc.)
        self.amount_patterns = [
            r'(?:Rs\.?|₹|INR|rs\.?)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',  # Rs. 1,234.56
            r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:Rs\.?|₹|INR)',        # 1,234.56 Rs
            r'\b(\d{1,3}(?:,\d{3})+\.\d{2})\b',                            # 1,234.56
            r'\b(\d{4,})\b',                                                # 1000 or more
        ]
        
        # Bank statement specific patterns
        self.bank_patterns = {
            'credit': r'(?:cr|credit|credited|deposit|received)\s*:?\s*(?:Rs\.?|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            'debit': r'(?:dr|debit|debited|withdraw|withdrawn|paid)\s*:?\s*(?:Rs\.?|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            'balance': r'(?:balance|bal|available balance)\s*:?\s*(?:Rs\.?|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)'
        }
        
        # Merchant/vendor patterns for auto-description
        self.merchant_patterns = [
            r'(?:from|to|merchant|vendor|seller|store)[\s:]+([A-Za-z0-9\s&.-]+)',
            r'(?:paid to|received from)[\s:]+([A-Za-z0-9\s&.-]+)',
            r'^([A-Z][A-Za-z0-9\s&.-]{2,30})',  # Capital letter starting name
        ]
    
    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        Advanced image preprocessing for better OCR accuracy.
        """
        # Convert to grayscale
        image = image.convert('L')
        
        # Increase contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        # Increase sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)
        
        # Denoise
        image = image.filter(ImageFilter.MedianFilter(size=3))
        
        # Resize if too small (OCR works better on larger images)
        width, height = image.size
        if width < 1000 or height < 1000:
            scale = max(1000 / width, 1000 / height)
            new_width = int(width * scale)
            new_height = int(height * scale)
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        return image
    
    def extract_text(self, image: Image.Image) -> str:
        """
        Extract text from image with preprocessing and Multi-PSM strategy.
        """
        try:
            # Preprocess
            processed_image = self.preprocess_image(image)
            
            # Multi-PSM Strategy
            # PSM 6: Assume a single uniform block of text. Good for receipts.
            # PSM 3: Fully automatic page segmentation, but no OSD. (Default)
            # PSM 4: Assume a single column of text of variable sizes.
            
            configs = [
                r'--oem 3 --psm 6',
                r'--oem 3 --psm 3',
                r'--oem 3 --psm 4'
            ]
            
            best_text = ""
            max_len = 0
            
            for config in configs:
                text = pytesseract.image_to_string(processed_image, config=config)
                cleaned_text = text.strip()
                if len(cleaned_text) > max_len:
                    max_len = len(cleaned_text)
                    best_text = cleaned_text
            
            return best_text
        except Exception as e:
            print(f"OCR extraction error: {e}")
            return ""
    
    def extract_date(self, text: str) -> Optional[str]:
        """
        Extract date from text with multiple format support.
        """
        for pattern in self.date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date_str = match.group(0)
                
                # Try to parse the date
                date_formats = [
                    '%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y',
                    '%Y-%m-%d', '%Y/%m/%d',
                    '%d %b %Y', '%d %B %Y',
                    '%b %d, %Y', '%B %d, %Y'
                ]
                
                for fmt in date_formats:
                    try:
                        parsed_date = datetime.strptime(date_str, fmt)
                        return parsed_date.strftime('%Y-%m-%d')
                    except ValueError:
                        continue
        
        # If no date found, return today
        return datetime.now().strftime('%Y-%m-%d')
    
    def extract_total_amount(self, text: str) -> Optional[float]:
        """
        Intelligently extract the TOTAL/MAIN amount, not individual items.
        This is the most critical function.
        """
        lines = text.split('\n')
        candidates = []
        
        # Strategy 1: Look for lines with "total" keywords
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Check if line contains total keyword
            has_total_keyword = any(keyword in line_lower for keyword in self.total_keywords)
            
            # Check if line should be ignored
            should_ignore = any(keyword in line_lower for keyword in self.ignore_keywords)
            
            if has_total_keyword and not should_ignore:
                # Extract amount from this line
                for pattern in self.amount_patterns:
                    matches = re.findall(pattern, line, re.IGNORECASE)
                    for match in matches:
                        amount = self._clean_amount(match)
                        if amount is not None:
                            # Higher priority for lines with "total"
                            priority = 100
                            if 'grand total' in line_lower or 'net amount' in line_lower:
                                priority = 200
                            candidates.append({
                                'amount': amount,
                                'priority': priority,
                                'line': line,
                                'line_index': i
                            })
                
                # Also check the NEXT line for the amount (common in some receipts)
                if i + 1 < len(lines):
                    next_line = lines[i+1]
                    for pattern in self.amount_patterns:
                        matches = re.findall(pattern, next_line, re.IGNORECASE)
                        for match in matches:
                            amount = self._clean_amount(match)
                            if amount is not None:
                                candidates.append({
                                    'amount': amount,
                                    'priority': 90, # Slightly lower than same-line
                                    'line': next_line,
                                    'line_index': i+1
                                })

        
        # Strategy 2: If no total found, look for bank statement patterns
        if not candidates:
            for pattern_name, pattern in self.bank_patterns.items():
                if pattern_name in ['credit', 'debit']:  # Ignore balance
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    for match in matches:
                        amount = self._clean_amount(match)
                        if amount is not None:
                            candidates.append({
                                'amount': amount,
                                'priority': 80,
                                'line': match,
                                'line_index': -1
                            })
        
        # Strategy 3: Look for the largest amount in the document (likely the total)
        if not candidates:
            all_amounts = []
            for line in lines:
                # Skip lines with ignore keywords
                line_lower = line.lower()
                if any(keyword in line_lower for keyword in self.ignore_keywords):
                    continue
                
                for pattern in self.amount_patterns:
                    matches = re.findall(pattern, line, re.IGNORECASE)
                    for match in matches:
                        amount = self._clean_amount(match)
                        if amount is not None and amount > 1.0:  # Relaxed: allow amounts > 1
                            # Filter out years (e.g. 2023, 2024) ONLY if they are integers
                            # If it has decimals (2024.50), it's likely an amount
                            if amount.is_integer() and 2000 <= amount <= 2100:
                                continue
                            all_amounts.append(amount)
            
            if all_amounts:
                # Return the largest amount (likely the total)
                max_amount = max(all_amounts)
                candidates.append({
                    'amount': max_amount,
                    'priority': 50,
                    'line': '',
                    'line_index': -1
                })
        
        # Sort by priority and return highest
        if candidates:
            candidates.sort(key=lambda x: x['priority'], reverse=True)
            return candidates[0]['amount']
        
        return None
    
    def _clean_amount(self, amount_str: str) -> Optional[float]:
        """
        Clean and convert amount string to float.
        """
        try:
            # If there are spaces between digits, it might be two numbers (e.g. "2 470.00")
            # We should take the last part if it looks like a valid amount
            if ' ' in amount_str:
                parts = amount_str.split()
                # Try the last part first
                last_part = parts[-1]
                # Check if last part is a valid number (allowing commas and dots)
                if re.match(r'^\d+(?:,\d{3})*(?:\.\d{2})?$', last_part.replace(',', '')):
                    amount_str = last_part
            
            # Remove currency symbols and spaces
            cleaned = re.sub(r'[^\d,.]', '', amount_str)
            # Remove commas
            cleaned = cleaned.replace(',', '')
            
            # Handle cases where there are multiple dots (e.g. 1.234.56) - keep only the last one
            if cleaned.count('.') > 1:
                parts = cleaned.split('.')
                cleaned = "".join(parts[:-1]) + "." + parts[-1]
            
            # Convert to float
            amount = float(cleaned)
            return amount
        except (ValueError, AttributeError):
            return None
    
    def extract_description(self, text: str) -> str:
        """
        Intelligently extract or generate transaction description.
        """
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Strategy 1: Look for known merchants (High Priority)
        known_merchants = [
            'Zomato', 'Swiggy', 'Uber', 'Ola', 'Amazon', 'Flipkart', 'Myntra', 'Ajio',
            'Starbucks', 'McDonalds', 'KFC', 'Dominos', 'Pizza Hut', 'Burger King',
            'Subway', 'Dmart', 'BigBasket', 'Blinkit', 'Zepto', 'Dunzo'
        ]
        
        for merchant in known_merchants:
            if merchant.lower() in text.lower():
                return merchant
        
        # Strategy 2: Look for merchant/vendor name
        for pattern in self.merchant_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                merchant = match.group(1).strip()
                # Clean up merchant name
                merchant = re.sub(r'\s+', ' ', merchant)
                if 3 < len(merchant) < 50:
                    return merchant
        
        # Strategy 3: Look for first meaningful line (not date, not amount)
        for line in lines[:5]:  # Check first 5 lines
            line_lower = line.lower()
            
            # Skip if line is just numbers or very short
            if len(line) < 4 or line.isdigit():
                continue
            
            # Skip if line contains only date
            if any(re.search(pattern, line) for pattern in self.date_patterns):
                if len(line) < 15:  # If line is just a date
                    continue
            
            # Skip if line contains ignore keywords
            if any(keyword in line_lower for keyword in self.ignore_keywords):
                continue
            
            # This is likely a good description
            cleaned = re.sub(r'\s+', ' ', line)
            if len(cleaned) > 4:
                return cleaned[:100]  # Max 100 chars
        
        # Strategy 4: Look for transaction type in text
        transaction_types = {
            'payment': 'Payment Transaction',
            'transfer': 'Fund Transfer',
            'deposit': 'Deposit',
            'withdrawal': 'Withdrawal',
            'purchase': 'Purchase',
            'refund': 'Refund',
            'food': 'Food Order',
            'cab': 'Cab Service',
            'trip': 'Trip',
            'ride': 'Ride'
        }
        
        text_lower = text.lower()
        for keyword, description in transaction_types.items():
            if keyword in text_lower:
                return description
        
        # Strategy 5: Default description
        return "Transaction"
    
    def detect_transaction_type(self, text: str, description: str) -> str:
        """
        Detect if transaction is income or expense based on context.
        """
        text_lower = text.lower()
        description_lower = description.lower()
        
        # Income indicators
        income_keywords = [
            'credit', 'credited', 'received', 'deposit', 'deposited',
            'salary', 'payment received', 'refund', 'cashback',
            'transferred to your account', 'added to', 'income'
        ]
        
        # Expense indicators
        expense_keywords = [
            'debit', 'debited', 'paid', 'payment', 'purchase',
            'withdrawn', 'transferred from your account', 'expense',
            'bill', 'invoice', 'order', 'booking'
        ]
        
        income_score = sum(1 for keyword in income_keywords if keyword in text_lower)
        expense_score = sum(1 for keyword in expense_keywords if keyword in text_lower)
        
        if income_score > expense_score:
            return 'income'
        else:
            return 'expense'  # Default to expense
    
    def extract_transactions(self, image_file) -> List[Dict]:
        """
        Main method: Extract all transaction details from image.
        Returns list of transactions with date, description, amount, type.
        """
        try:
            # Read file content once and create Image object
            file_content = image_file.read()
            image = Image.open(io.BytesIO(file_content))
        except Exception as e:
            print(f"Error opening image file: {e}")
            return []
        
        # Try 1: With Preprocessing
        print("OCR Try 1: With Preprocessing")
        text = self.extract_text(image)
        
        amount = self.extract_total_amount(text)
        
        # Try 2: Without Preprocessing (Raw Image) if no amount found
        if not amount:
            print("OCR Try 2: Raw Image (Preprocessing failed to find amount)")
            try:
                # Use simple config on raw image
                text_raw = pytesseract.image_to_string(image)
                text = text_raw # Update text to use raw text
                amount = self.extract_total_amount(text)
            except Exception as e:
                print(f"Raw OCR failed: {e}")
        
        if not text or len(text.strip()) < 5:
            print("OCR failed to extract any text.")
            return []
        
        print(f"Extracted text ({len(text)} chars):")
        print(text[:500])  # Print first 500 chars for debugging
        
        # Extract components
        date = self.extract_date(text)
        description = self.extract_description(text)
        transaction_type = self.detect_transaction_type(text, description)
        
        if not amount:
            print("No amount found in text even after fallback.")
            return []
        
        print(f"Extracted: Date={date}, Amount={amount}, Desc={description}, Type={transaction_type}")
        
        # Return single transaction (the main one)
        return [{
            'date': date,
            'description': description,
            'amount': amount,
            'type': transaction_type,
            'raw_text': text[:500]  # Keep sample for debugging
        }]


# Backup: Google Cloud Vision API Integration (Optional)
class GoogleVisionOCR:
    """
    Google Cloud Vision API for superior OCR accuracy.
    Use this for production if Tesseract accuracy is insufficient.
    """
    
    def __init__(self, api_key: str):
        """
        Initialize with Google Cloud API key.
        pip install google-cloud-vision
        """
        try:
            from google.cloud import vision
            self.client = vision.ImageAnnotatorClient()
            self.enabled = True
        except ImportError:
            print("Google Cloud Vision not installed. Using Tesseract.")
            self.enabled = False
    
    def extract_text(self, image_file) -> str:
        """
        Extract text using Google Cloud Vision API.
        """
        if not self.enabled:
            return ""
        
        try:
            from google.cloud import vision
            
            content = image_file.read()
            image = vision.Image(content=content)
            
            response = self.client.text_detection(image=image)
            texts = response.text_annotations
            
            if texts:
                return texts[0].description
            
            return ""
        except Exception as e:
            print(f"Google Vision error: {e}")
            return ""
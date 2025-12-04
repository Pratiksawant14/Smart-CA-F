import os
import re
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
import joblib
import pandas as pd
import csv
from io import StringIO

# Import engines
from ml.analytics_engine import AnalyticsEngine
from ml.tax_engine import TaxEngine
from ml.ocr_engine import EnhancedOCREngine  # NEW: Enhanced OCR

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing Supabase credentials. Please check your .env file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Load the trained ML model
# Load the trained ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'transaction_categorizer.joblib')
try:
    ml_model = joblib.load(MODEL_PATH)
    print("✅ ML Model loaded successfully!")
except FileNotFoundError:
    print("❌ Model file not found. Please run 'python ml/train_model.py' first.")
    ml_model = None

# Initialize Engines
analytics_engine = AnalyticsEngine()
print("✅ Analytics Engine initialized!")

tax_engine = TaxEngine()
print("✅ Tax Engine initialized!")

ocr_engine = EnhancedOCREngine()  # NEW
print("✅ Enhanced OCR Engine initialized!")

@app.route('/')
def hello():
    return jsonify({
        "message": "Smart CA Backend - Phase 4 COMPLETE + Enhanced OCR",
        "status": "All Systems Active",
        "version": "4.1.0",
        "features": [
            "Enhanced OCR (Bills, Receipts, Bank Statements)",
            "ML Categorization",
            "Analytics",
            "Tax Calculation",
            "Notifications",
            "Reports"
        ]
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "service": "smart-ca-backend",
        "ml_model_loaded": ml_model is not None,
        "analytics_engine": "active",
        "tax_engine": "active",
        "ocr_engine": "enhanced"
    })

def authenticate_user(auth_header):
    """Authenticate user using JWT token from Supabase."""
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.replace('Bearer ', '')
    
    try:
        response = supabase.auth.get_user(token)
        return response.user
    except Exception as e:
        print(f"Authentication error: {e}")
        return None

def categorize_transaction(description, transaction_type='expense'):
    """Use the ML model to predict the category of a transaction."""
    if ml_model is None:
        return "Uncategorized"
    
    try:
        category = ml_model.predict([description])[0]
        
        # If ML says "Income" but transaction_type is expense, override
        if category == "Income" and transaction_type == 'expense':
            # Try to recategorize as expense
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
        print(f"Categorization error: {e}")
        return "Uncategorized"

@app.route('/api/upload_and_process', methods=['POST'])
def upload_and_process():
    """
    ENHANCED PHASE 2 - AI-powered transaction processing with advanced OCR.
    """
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized. Invalid or missing token."}), 401
        
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
        
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'pdf'}
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_ext not in allowed_extensions:
            return jsonify({"error": "Invalid file type. Please upload an image."}), 400
        
        print(f"\n{'='*60}")
        print(f"Processing file: {file.filename} for user: {user.email}")
        print(f"{'='*60}")
        
        # Use Enhanced OCR Engine
        print("🔍 Running Enhanced OCR extraction...")
        
        # Reset file pointer
        file.seek(0)
        extracted_transactions = ocr_engine.extract_transactions(file)
        
        if not extracted_transactions or len(extracted_transactions) == 0:
            return jsonify({
                "error": "Could not extract transaction from the image. Please ensure the image is clear and contains transaction information (date, amount, description)."
            }), 400
        
        print(f"✅ Extracted {len(extracted_transactions)} transaction(s)")
        
        saved_transactions = []
        
        for trans in extracted_transactions:
            # Categorize using ML
            print(f"🤖 Categorizing: {trans['description']}")
            category = categorize_transaction(trans['description'], trans['type'])
            
            # Prepare data for Supabase
            transaction_data = {
                'user_id': user.id,
                'transaction_date': trans['date'],
                'description': trans['description'][:500],
                'amount': trans['amount'],
                'type': trans['type'],
                'category': category
            }
            
            print(f"💾 Saving: {trans['description'][:50]} | ₹{trans['amount']} | {category} | {trans['type']}")
            
            try:
                result = supabase.table('transactions').insert(transaction_data).execute()
                saved_transactions.append({
                    'description': trans['description'],
                    'amount': trans['amount'],
                    'category': category,
                    'type': trans['type'],
                    'date': trans['date']
                })
            except Exception as e:
                print(f"❌ Database insert error: {e}")
                continue
        
        print(f"✅ Successfully saved {len(saved_transactions)} transaction(s)")
        print(f"{'='*60}\n")
        
        return jsonify({
            "success": True,
            "message": f"Successfully processed {len(saved_transactions)} transaction(s)",
            "transactions": saved_transactions,
            "extraction_details": {
                "total_found": len(extracted_transactions),
                "saved": len(saved_transactions)
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error in upload_and_process: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/categorize', methods=['POST'])
def categorize():
    """Endpoint to categorize a single transaction description."""
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        data = request.get_json()
        description = data.get('description', '')
        
        if not description:
            return jsonify({"error": "Description is required"}), 400
        
        category = categorize_transaction(description)
        
        return jsonify({
            "success": True,
            "description": description,
            "category": category
        }), 200
        
    except Exception as e:
        print(f"Error in categorize: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """PHASE 3 - Comprehensive analytics."""
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized. Invalid or missing token."}), 401
        
        print(f"Fetching analytics for user: {user.email}")
        
        try:
            response = supabase.table('transactions').select('*').eq('user_id', user.id).execute()
            transactions = response.data
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"error": "Failed to fetch transactions from database"}), 500
        
        if not transactions or len(transactions) == 0:
            return jsonify({
                "error": "No transactions found. Please add some transactions first.",
                "volatility": None,
                "audit_risk": None,
                "forecast": None
            }), 200
        
        print(f"Found {len(transactions)} transactions")
        
        df = pd.DataFrame(transactions)
        df['amount'] = df['amount'].astype(float)
        
        print("Running volatility analysis...")
        volatility_result = analytics_engine.detect_volatility(df)
        
        print("Running audit risk prediction...")
        audit_risk_result = analytics_engine.predict_audit_risk(df)
        
        print("Running income forecasting...")
        forecast_result = analytics_engine.forecast_income(df)
        
        analytics_data = {
            "success": True,
            "user_email": user.email,
            "analysis_date": datetime.now().isoformat(),
            "total_transactions": len(transactions),
            "volatility": volatility_result,
            "audit_risk": audit_risk_result,
            "forecast": forecast_result
        }
        
        return jsonify(analytics_data), 200
        
    except Exception as e:
        print(f"Error in get_analytics: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Analytics error: {str(e)}"}), 500

@app.route('/api/tax_summary', methods=['GET'])
def get_tax_summary():
    """PHASE 4 - Tax Calculation with XAI."""
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        print(f"Calculating tax for user: {user.email}")
        
        try:
            response = supabase.table('transactions').select('*').eq('user_id', user.id).execute()
            transactions = response.data
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"error": "Failed to fetch transactions"}), 500
        
        if not transactions or len(transactions) == 0:
            result = tax_engine._empty_result()
            return jsonify({
                "success": True,
                "user_email": user.email,
                "calculation_date": datetime.now().isoformat(),
                **result
            }), 200
        
        print(f"Found {len(transactions)} transactions")
        
        df = pd.DataFrame(transactions)
        df['amount'] = df['amount'].astype(float)
        
        print("Running tax calculations...")
        tax_result = tax_engine.calculate_tax(df)
        
        tax_calendar = tax_engine.get_tax_calendar()
        
        if tax_result.get('gst_applicable') and tax_result.get('gst_liability', 0) > 0:
            try:
                supabase.rpc('create_notification', {
                    'p_user_id': str(user.id),
                    'p_message': f'GST registration required. Your income (₹{tax_result["gross_income"]:,.0f}) exceeds ₹20 lakhs.',
                    'p_type': 'warning'
                }).execute()
            except Exception as e:
                print(f"Notification error: {e}")
        
        response_data = {
            "success": True,
            "user_email": user.email,
            "calculation_date": datetime.now().isoformat(),
            "tax_calendar": tax_calendar,
            **tax_result
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error in get_tax_summary: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Tax calculation error: {str(e)}"}), 500

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """PHASE 4 - Fetch user notifications."""
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        try:
            query = supabase.table('notifications').select('*').eq('user_id', user.id)
            
            if unread_only:
                query = query.eq('is_read', False)
            
            response = query.order('created_at', desc=True).limit(50).execute()
            notifications = response.data
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"error": "Failed to fetch notifications"}), 500
        
        try:
            unread_response = supabase.table('notifications').select('id', count='exact').eq('user_id', user.id).eq('is_read', False).execute()
            unread_count = unread_response.count if unread_response.count else 0
        except:
            unread_count = 0
        
        return jsonify({
            "success": True,
            "notifications": notifications or [],
            "unread_count": unread_count
        }), 200
        
    except Exception as e:
        print(f"Error in get_notifications: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/notifications/<notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Mark a notification as read."""
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        try:
            supabase.table('notifications').update({
                'is_read': True
            }).eq('id', notification_id).eq('user_id', user.id).execute()
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"error": "Failed to update notification"}), 500
        
        return jsonify({"success": True}), 200
        
    except Exception as e:
        print(f"Error marking notification read: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/export_report', methods=['GET'])
def export_report():
    """PHASE 4 - Export transactions as CSV."""
    try:
        auth_header = request.headers.get('Authorization')
        user = authenticate_user(auth_header)
        
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        print(f"Exporting report for user: {user.email}")
        
        try:
            response = supabase.table('transactions').select('*').eq('user_id', user.id).order('transaction_date', desc=True).execute()
            transactions = response.data
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"error": "Failed to fetch transactions"}), 500
        
        if not transactions or len(transactions) == 0:
            return jsonify({"error": "No transactions to export"}), 404
        
        output = StringIO()
        writer = csv.writer(output)
        
        writer.writerow([
            'Date',
            'Description',
            'Category',
            'Type',
            'Amount (₹)',
            'Created At'
        ])
        
        for trans in transactions:
            writer.writerow([
                trans.get('transaction_date', ''),
                trans.get('description', ''),
                trans.get('category', 'Uncategorized'),
                trans.get('type', '').capitalize(),
                f"{float(trans.get('amount', 0)):.2f}",
                trans.get('created_at', '')
            ])
        
        csv_string = output.getvalue()
        output.close()
        
        filename = f"smart_ca_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        return jsonify({
            "success": True,
            "filename": filename,
            "data": csv_string,
            "record_count": len(transactions)
        }), 200
        
    except Exception as e:
        print(f"Error in export_report: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Export error: {str(e)}"}), 500

if __name__ == '__main__':
    if ml_model is None:
        print("\n⚠️  WARNING: ML Model not loaded!")
        print("Please run: python ml/train_model.py")
        print("Then restart the Flask server.\n")
    
    print("\n" + "="*60)
    print("SMART CA BACKEND - PHASE 4 + ENHANCED OCR")
    print("="*60)
    print("✅ Enhanced OCR Engine: Active")
    print("   • Intelligent total amount extraction")
    print("   • Multi-format support (Bills, Bank Statements)")
    print("   • Auto description generation")
    print("   • Income/Expense detection")
    print("✅ ML Categorization: Active")
    print("✅ Analytics Engine: Active")
    print("✅ Tax Engine: Active")
    print("✅ Notifications: Active")
    print("✅ Report Export: Active")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
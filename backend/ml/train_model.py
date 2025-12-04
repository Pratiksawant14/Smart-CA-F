import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
import joblib
import os

def create_training_data():
    # We train on specific items AND vendor names
    training_data = {'description': [], 'category': []}
    
    # 1. FOOD (Items found in food bills)
    food_keywords = [
        'Zomato', 'Swiggy', 'McDonalds', 'KFC', 'Dominos', 'Pizza', 'Burger',
        'Starbucks', 'Coffee', 'Cafe', 'Tea', 'Restaurant', 'Dining', 'Bar',
        'Butter Chicken', 'Naan', 'Roti', 'Paneer', 'Biryani', 'Thali',
        'Delivery Fee', 'Packaging Charge', 'Restaurant Service Charge',
        'Chocolate', 'Cake', 'Bakery', 'Ice Cream', 'Subway', 'Taco',
        'Diner', 'Bistro', 'Eatery', 'Food Court', 'Canteen', 'Mess',
        'Lunch', 'Dinner', 'Breakfast', 'Snacks', 'Beverages', 'Juice',
        'Sweet', 'Mithai', 'Haldiram', 'Bikanervala', 'Saravana Bhavan',
        'Zomato Order', 'Swiggy Order', 'Food Order'
    ]
    training_data['description'].extend(food_keywords)
    training_data['category'].extend(['Food'] * len(food_keywords))
    
    # 2. TRANSPORT (Items found in travel bills)
    transport_keywords = [
        'Uber', 'Ola', 'Rapido', 'Lyft', 'Cab', 'Taxi', 'Auto', 'Ride',
        'Metro', 'Train', 'Bus', 'Flight', 'Airline', 'Indigo', 'Air India',
        'Petrol', 'Diesel', 'Fuel', 'Shell', 'HP Petrol', 'Parking', 'Toll',
        'Fastag', 'Distance Fare', 'Ride Time', 'Base Fare', 'Access Fee',
        'Trip', 'Travel', 'Ticket', 'IRCTC', 'Vistara', 'SpiceJet',
        'Indian Oil', 'Bharat Petroleum', 'Hindustan Petroleum', 'CNG',
        'Driver', 'Fare', 'Pass', 'Commute',
        'Uber Trip', 'Ola Trip', 'Cab Ride'
    ]
    training_data['description'].extend(transport_keywords)
    training_data['category'].extend(['Transport'] * len(transport_keywords))
    
    # 3. SHOPPING & OFFICE (Items found in Amazon/Flipkart bills)
    shopping_keywords = [
        'Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Retail', 'Store', 'Shop',
        'Logitech', 'Mouse', 'Keyboard', 'Laptop', 'Monitor', 'USB', 'Cable',
        'Headphones', 'Notebook', 'Pen', 'Paper', 'Stationery', 'Desk',
        'Chair', 'Electronics', 'Gadget', 'Mobile', 'Phone', 'Cover', 'Guard',
        'Shipping', 'Delivery', 'Purchase', 'IKEA', 'Decathlon',
        'Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Uniqlo', 'Reliance Digital',
        'Croma', 'Vijay Sales', 'Apple Store', 'Samsung', 'Sony', 'Bose',
        'Printer', 'Ink', 'Toner', 'Stapler', 'Files', 'Folders',
        'Amazon Purchase', 'Flipkart Order'
    ]
    # Removed generic 'Order' to avoid confusion
    training_data['description'].extend(shopping_keywords)
    training_data['category'].extend(['Shopping'] * len(shopping_keywords))
    
    # 4. SOFTWARE & SUBSCRIPTIONS (Items found in digital bills)
    software_keywords = [
        'Adobe', 'Netflix', 'Spotify', 'Prime', 'YouTube', 'Google', 'Apple',
        'Microsoft', 'Office 365', 'AWS', 'Azure', 'DigitalOcean', 'GoDaddy',
        'Hostinger', 'Subscription', 'Plan', 'Cloud', 'Storage', 'License',
        'Pro', 'Premium', 'Membership', 'Renewal', 'SaaS', 'Hosting',
        'Creative Cloud', 'Photoshop', 'Figma', 'Canva', 'ChatGPT', 'OpenAI',
        'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Trello', 'Notion', 'Slack',
        'Zoom', 'Teams', 'Meet', 'Discord', 'Steam', 'PlayStation', 'Xbox'
    ]
    training_data['description'].extend(software_keywords)
    training_data['category'].extend(['Software'] * len(software_keywords))

    # 5. UTILITIES (Electricity, Internet, Phone)
    utilities_keywords = [
        'Electricity', 'Power', 'Bill', 'Water', 'Gas', 'Internet', 'Broadband',
        'Fiber', 'WiFi', 'Recharge', 'Prepaid', 'Postpaid', 'DTH', 'Tata Sky',
        'Airtel', 'Jio', 'Vi', 'Vodafone', 'Idea', 'BSNL', 'MTNL', 'ACT Fibernet',
        'Spectra', 'Hathway', 'Bescom', 'Adani Electricity', 'Tata Power'
    ]
    training_data['description'].extend(utilities_keywords)
    training_data['category'].extend(['Utilities'] * len(utilities_keywords))

    # 6. MEDICAL & HEALTH (New Category)
    medical_keywords = [
        'Pharmacy', 'Chemist', 'Medical', 'Hospital', 'Clinic', 'Doctor',
        'Consultation', 'Test', 'Lab', 'Diagnostics', 'Apollo', 'Practo',
        '1mg', 'Pharmeasy', 'Netmeds', 'Medplus', 'Fortis', 'Max', 'Manipal',
        'Medicine', 'Tablet', 'Syrup', 'Injection', 'Vaccine', 'Health',
        'Insurance', 'Premium', 'Policy', 'Checkup', 'Dental', 'Eye', 'Vision'
    ]
    training_data['description'].extend(medical_keywords)
    training_data['category'].extend(['Medical'] * len(medical_keywords))

    # 7. INCOME (New Category for earnings)
    income_keywords = [
        'Salary', 'Credited', 'Credit', 'Deposit', 'Deposited', 'Refund',
        'Cashback', 'Dividend', 'Interest', 'Client Payment', 'Payment Received',
        'Transfer In', 'Inward', 'Revenue', 'Sales', 'Consultation Fee',
        'Stipend', 'Bonus', 'Award', 'Prize', 'Gift', 'Allowance',
        'Reimbursement', 'Settlement', 'Claim', 'UPI Credit', 'IMPS Credit',
        'NEFT Credit', 'RTGS Credit', 'ABC Tech', 'Client', 'Freelance'
    ]
    training_data['description'].extend(income_keywords)
    training_data['category'].extend(['Income'] * len(income_keywords))

    return pd.DataFrame(training_data)

def train_model():
    print("Training Universal Model...")
    df = create_training_data()
    
    X = df['description'].values
    y = df['category'].values
    
    # Using n_grams (1,2) helps recognize "Butter Chicken" as a phrase, not just words
    model_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2), lowercase=True)),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    model_pipeline.fit(X, y)
    print("✓ Universal Model trained successfully.")
    
    # Save model to the same directory as this script (backend/ml) -> up one level -> backend
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(current_dir)
    model_path = os.path.join(backend_dir, 'transaction_categorizer.joblib')
    
    joblib.dump(model_pipeline, model_path)
    print(f"✓ Model saved as '{model_path}'")

if __name__ == '__main__':
    train_model()
"""
Smart CA Analytics Engine - Phase 3
Provides income volatility detection, audit risk prediction, and forecasting.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

class AnalyticsEngine:
    """
    Analytics engine for freelancer financial insights.
    Implements income volatility detection, audit risk scoring, and forecasting.
    """
    
    def __init__(self):
        self.min_data_points = 3  # Minimum months of data required
        
    def detect_volatility(self, transactions_df):
        """
        Analyze income volatility to identify financial instability.
        
        Returns:
            dict: {
                'score': float (0-100, higher = more volatile),
                'risk_level': str ('Low', 'Medium', 'High'),
                'monthly_income': list of {month, amount},
                'statistics': {mean, std_dev, cv, ...},
                'alerts': list of alert messages
            }
        """
        try:
            # Filter for income transactions
            income_df = transactions_df[
                (transactions_df['type'] == 'income') & 
                (transactions_df['category'] == 'Income')
            ].copy()
            
            if len(income_df) == 0:
                return {
                    'score': 0,
                    'risk_level': 'Unknown',
                    'monthly_income': [],
                    'statistics': {},
                    'alerts': ['No income data available for analysis'],
                    'error': 'No income transactions found'
                }
            
            # Convert transaction_date to datetime
            income_df['transaction_date'] = pd.to_datetime(income_df['transaction_date'])
            
            # Extract year-month
            income_df['year_month'] = income_df['transaction_date'].dt.to_period('M')
            
            # Aggregate by month
            monthly_income = income_df.groupby('year_month')['amount'].sum().reset_index()
            monthly_income.columns = ['month', 'amount']
            monthly_income['amount'] = monthly_income['amount'].astype(float)
            
            if len(monthly_income) < self.min_data_points:
                return {
                    'score': 0,
                    'risk_level': 'Insufficient Data',
                    'monthly_income': monthly_income.to_dict('records'),
                    'statistics': {},
                    'alerts': [f'Need at least {self.min_data_points} months of data for analysis'],
                    'error': 'Insufficient data points'
                }
            
            # Calculate statistics
            amounts = monthly_income['amount'].values
            mean_income = np.mean(amounts)
            std_dev = np.std(amounts)
            median_income = np.median(amounts)
            
            # Coefficient of Variation (CV) - key volatility metric
            cv = (std_dev / mean_income) * 100 if mean_income > 0 else 0
            
            # Calculate volatility score (0-100)
            # CV > 50% is considered high volatility
            volatility_score = min(cv * 2, 100)
            
            # Determine risk level
            if volatility_score < 30:
                risk_level = 'Low'
            elif volatility_score < 60:
                risk_level = 'Medium'
            else:
                risk_level = 'High'
            
            # Detect anomalies
            alerts = []
            
            # Detect droughts (< 20% of mean)
            drought_threshold = mean_income * 0.2
            droughts = monthly_income[monthly_income['amount'] < drought_threshold]
            if len(droughts) > 0:
                for _, row in droughts.iterrows():
                    alerts.append({
                        'type': 'drought',
                        'severity': 'high',
                        'month': str(row['month']),
                        'amount': float(row['amount']),
                        'message': f"Income drought detected in {row['month']}: ₹{row['amount']:,.2f} (only {(row['amount']/mean_income)*100:.1f}% of average)"
                    })
            
            # Detect spikes (> 200% of mean)
            spike_threshold = mean_income * 2.0
            spikes = monthly_income[monthly_income['amount'] > spike_threshold]
            if len(spikes) > 0:
                for _, row in spikes.iterrows():
                    alerts.append({
                        'type': 'spike',
                        'severity': 'medium',
                        'month': str(row['month']),
                        'amount': float(row['amount']),
                        'message': f"Income spike in {row['month']}: ₹{row['amount']:,.2f} ({(row['amount']/mean_income)*100:.1f}% of average)"
                    })
            
            # Detect consecutive declining months
            if len(monthly_income) >= 3:
                recent_3_months = monthly_income.tail(3)['amount'].values
                if all(recent_3_months[i] > recent_3_months[i+1] for i in range(len(recent_3_months)-1)):
                    alerts.append({
                        'type': 'declining_trend',
                        'severity': 'high',
                        'message': 'Warning: Income has declined for 3 consecutive months'
                    })
            
            # Detect zero income months
            zero_months = monthly_income[monthly_income['amount'] == 0]
            if len(zero_months) > 0:
                alerts.append({
                    'type': 'zero_income',
                    'severity': 'critical',
                    'message': f'{len(zero_months)} month(s) with zero income detected'
                })
            
            # Convert monthly_income for JSON serialization
            monthly_data = []
            for _, row in monthly_income.iterrows():
                monthly_data.append({
                    'month': str(row['month']),
                    'amount': float(row['amount'])
                })
            
            statistics = {
                'mean': float(mean_income),
                'median': float(median_income),
                'std_dev': float(std_dev),
                'min': float(amounts.min()),
                'max': float(amounts.max()),
                'cv': float(cv),
                'total_months': len(monthly_income),
                'total_income': float(amounts.sum())
            }
            
            return {
                'score': float(volatility_score),
                'risk_level': risk_level,
                'monthly_income': monthly_data,
                'statistics': statistics,
                'alerts': alerts
            }
            
        except Exception as e:
            return {
                'score': 0,
                'risk_level': 'Error',
                'monthly_income': [],
                'statistics': {},
                'alerts': [f'Error analyzing volatility: {str(e)}'],
                'error': str(e)
            }
    
    def predict_audit_risk(self, transactions_df):
        """
        Calculate audit risk score based on transaction patterns.
        
        Returns:
            dict: {
                'risk_score': int (0-100),
                'risk_level': str ('Low', 'Medium', 'High'),
                'factors': list of risk factors,
                'explanation': str (XAI - explainable AI),
                'recommendations': list of strings
            }
        """
        try:
            if len(transactions_df) == 0:
                return {
                    'risk_score': 0,
                    'risk_level': 'Unknown',
                    'factors': [],
                    'explanation': 'No transaction data available for audit risk assessment',
                    'recommendations': ['Add transactions to get started'],
                    'error': 'No transactions found'
                }
            
            risk_factors = []
            risk_score = 0
            
            # Factor 1: Uncategorized transactions
            total_transactions = len(transactions_df)
            uncategorized = len(transactions_df[
                (transactions_df['category'].isna()) | 
                (transactions_df['category'] == 'Uncategorized')
            ])
            uncategorized_pct = (uncategorized / total_transactions) * 100 if total_transactions > 0 else 0
            
            if uncategorized_pct > 30:
                risk_score += 25
                risk_factors.append({
                    'factor': 'High Uncategorized Transactions',
                    'value': f'{uncategorized_pct:.1f}%',
                    'impact': 'High',
                    'weight': 25
                })
            elif uncategorized_pct > 15:
                risk_score += 15
                risk_factors.append({
                    'factor': 'Moderate Uncategorized Transactions',
                    'value': f'{uncategorized_pct:.1f}%',
                    'impact': 'Medium',
                    'weight': 15
                })
            
            # Factor 2: Income vs Expenses ratio
            total_income = transactions_df[transactions_df['type'] == 'income']['amount'].sum()
            total_expenses = transactions_df[transactions_df['type'] == 'expense']['amount'].sum()
            
            if total_income > 0:
                expense_ratio = (total_expenses / total_income) * 100
                
                if expense_ratio > 100:  # Expenses exceed income
                    risk_score += 30
                    risk_factors.append({
                        'factor': 'Expenses Exceed Income',
                        'value': f'{expense_ratio:.1f}%',
                        'impact': 'High',
                        'weight': 30
                    })
                elif expense_ratio > 80:
                    risk_score += 15
                    risk_factors.append({
                        'factor': 'High Expense Ratio',
                        'value': f'{expense_ratio:.1f}%',
                        'impact': 'Medium',
                        'weight': 15
                    })
            
            # Factor 3: Large cash transactions (>50,000)
            large_transactions = transactions_df[transactions_df['amount'] > 50000]
            large_cash_count = len(large_transactions)
            
            if large_cash_count > 10:
                risk_score += 20
                risk_factors.append({
                    'factor': 'Frequent Large Transactions',
                    'value': f'{large_cash_count} transactions',
                    'impact': 'Medium',
                    'weight': 20
                })
            elif large_cash_count > 5:
                risk_score += 10
                risk_factors.append({
                    'factor': 'Some Large Transactions',
                    'value': f'{large_cash_count} transactions',
                    'impact': 'Low',
                    'weight': 10
                })
            
            # Factor 4: Missing descriptions
            missing_descriptions = len(transactions_df[
                (transactions_df['description'].isna()) | 
                (transactions_df['description'].str.len() < 3)
            ])
            missing_desc_pct = (missing_descriptions / total_transactions) * 100
            
            if missing_desc_pct > 20:
                risk_score += 15
                risk_factors.append({
                    'factor': 'Poor Transaction Documentation',
                    'value': f'{missing_desc_pct:.1f}%',
                    'impact': 'Medium',
                    'weight': 15
                })
            
            # Factor 5: Income consistency (from volatility)
            volatility_result = self.detect_volatility(transactions_df)
            if 'score' in volatility_result and volatility_result['score'] > 60:
                risk_score += 10
                risk_factors.append({
                    'factor': 'Irregular Income Pattern',
                    'value': f"{volatility_result['risk_level']} volatility",
                    'impact': 'Medium',
                    'weight': 10
                })
            
            # Cap at 100
            risk_score = min(risk_score, 100)
            
            # Determine risk level
            if risk_score < 30:
                risk_level = 'Low'
            elif risk_score < 60:
                risk_level = 'Medium'
            else:
                risk_level = 'High'
            
            # Generate explanation (XAI)
            explanation = self._generate_audit_explanation(
                risk_score, risk_level, risk_factors, 
                uncategorized_pct, expense_ratio if total_income > 0 else 0
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(risk_factors)
            
            return {
                'risk_score': int(risk_score),
                'risk_level': risk_level,
                'factors': risk_factors,
                'explanation': explanation,
                'recommendations': recommendations,
                'statistics': {
                    'total_transactions': total_transactions,
                    'uncategorized_count': uncategorized,
                    'uncategorized_percentage': float(uncategorized_pct),
                    'total_income': float(total_income),
                    'total_expenses': float(total_expenses),
                    'expense_ratio': float(expense_ratio) if total_income > 0 else 0
                }
            }
            
        except Exception as e:
            return {
                'risk_score': 0,
                'risk_level': 'Error',
                'factors': [],
                'explanation': f'Error calculating audit risk: {str(e)}',
                'recommendations': [],
                'error': str(e)
            }
    
    def forecast_income(self, transactions_df):
        """
        Forecast future income using time series analysis.
        
        Returns:
            dict: {
                'forecast': list of {month, predicted_amount, confidence},
                'historical': list of {month, actual_amount},
                'trend': str ('increasing', 'decreasing', 'stable'),
                'accuracy': str (confidence level)
            }
        """
        try:
            # Filter for income
            income_df = transactions_df[
                (transactions_df['type'] == 'income') & 
                (transactions_df['category'] == 'Income')
            ].copy()
            
            if len(income_df) == 0:
                return {
                    'forecast': [],
                    'historical': [],
                    'trend': 'unknown',
                    'accuracy': 'No data',
                    'error': 'No income data available'
                }
            
            # Convert and aggregate
            income_df['transaction_date'] = pd.to_datetime(income_df['transaction_date'])
            income_df['year_month'] = income_df['transaction_date'].dt.to_period('M')
            
            monthly_income = income_df.groupby('year_month')['amount'].sum().reset_index()
            monthly_income.columns = ['month', 'amount']
            monthly_income['amount'] = monthly_income['amount'].astype(float)
            
            if len(monthly_income) < self.min_data_points:
                return {
                    'forecast': [],
                    'historical': monthly_income.to_dict('records'),
                    'trend': 'insufficient_data',
                    'accuracy': f'Need {self.min_data_points} months minimum',
                    'error': 'Insufficient data for forecasting'
                }
            
            # Prepare data for forecasting
            monthly_income = monthly_income.sort_values('month')
            monthly_income['month_num'] = range(len(monthly_income))
            
            X = monthly_income['month_num'].values.reshape(-1, 1)
            y = monthly_income['amount'].values
            
            # Fit linear regression model
            model = LinearRegression()
            model.fit(X, y)
            
            # Determine trend
            slope = model.coef_[0]
            if abs(slope) < np.mean(y) * 0.05:  # Less than 5% change
                trend = 'stable'
            elif slope > 0:
                trend = 'increasing'
            else:
                trend = 'decreasing'
            
            # Calculate R-squared for accuracy
            y_pred_train = model.predict(X)
            ss_res = np.sum((y - y_pred_train) ** 2)
            ss_tot = np.sum((y - np.mean(y)) ** 2)
            r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
            
            if r_squared > 0.7:
                accuracy = 'High'
            elif r_squared > 0.4:
                accuracy = 'Medium'
            else:
                accuracy = 'Low'
            
            # Forecast next 3 months
            last_month = monthly_income['month'].iloc[-1]
            last_month_num = monthly_income['month_num'].iloc[-1]
            
            forecast_data = []
            for i in range(1, 4):
                future_month_num = last_month_num + i
                predicted_amount = model.predict([[future_month_num]])[0]
                
                # Calculate confidence interval (simple approach)
                std_error = np.std(y - y_pred_train)
                confidence_lower = predicted_amount - (1.96 * std_error)
                confidence_upper = predicted_amount + (1.96 * std_error)
                
                # Generate future month period
                future_date = last_month.to_timestamp() + pd.DateOffset(months=i)
                future_month = pd.Period(future_date, freq='M')
                
                forecast_data.append({
                    'month': str(future_month),
                    'predicted_amount': float(max(0, predicted_amount)),  # No negative income
                    'confidence_lower': float(max(0, confidence_lower)),
                    'confidence_upper': float(confidence_upper),
                    'confidence': accuracy
                })
            
            # Format historical data
            historical_data = []
            for _, row in monthly_income.iterrows():
                historical_data.append({
                    'month': str(row['month']),
                    'actual_amount': float(row['amount'])
                })
            
            return {
                'forecast': forecast_data,
                'historical': historical_data,
                'trend': trend,
                'accuracy': accuracy,
                'model_stats': {
                    'slope': float(slope),
                    'intercept': float(model.intercept_),
                    'r_squared': float(r_squared),
                    'data_points': len(monthly_income)
                }
            }
            
        except Exception as e:
            return {
                'forecast': [],
                'historical': [],
                'trend': 'error',
                'accuracy': 'Error',
                'error': str(e)
            }
    
    def _generate_audit_explanation(self, risk_score, risk_level, risk_factors, 
                                   uncategorized_pct, expense_ratio):
        """Generate human-readable explanation for audit risk (XAI)."""
        
        explanation = f"Your audit risk level is **{risk_level}** with a score of {risk_score}/100. "
        
        if risk_level == 'Low':
            explanation += "Your financial records are well-organized and compliant. "
        elif risk_level == 'Medium':
            explanation += "There are some areas that need attention to reduce audit risk. "
        else:
            explanation += "Several risk factors have been identified that require immediate attention. "
        
        if len(risk_factors) > 0:
            explanation += "\n\nKey concerns:\n"
            for factor in risk_factors[:3]:  # Top 3 factors
                explanation += f"• {factor['factor']}: {factor['value']}\n"
        
        if uncategorized_pct > 30:
            explanation += f"\n⚠️ Critical: {uncategorized_pct:.1f}% of transactions are uncategorized. Tax authorities may view this as incomplete record-keeping."
        
        if expense_ratio > 100:
            explanation += f"\n⚠️ Critical: Your expenses exceed income by {expense_ratio - 100:.1f}%. This raises red flags for tax compliance."
        
        return explanation
    
    def _generate_recommendations(self, risk_factors):
        """Generate actionable recommendations based on risk factors."""
        
        recommendations = []
        
        factor_names = [f['factor'] for f in risk_factors]
        
        if any('Uncategorized' in f for f in factor_names):
            recommendations.append("Categorize all transactions using the AI scanner or manual entry")
        
        if any('Expenses Exceed Income' in f for f in factor_names):
            recommendations.append("Review expense patterns and identify cost-cutting opportunities")
            recommendations.append("Consider increasing billable hours or rates")
        
        if any('Large Transactions' in f for f in factor_names):
            recommendations.append("Maintain detailed receipts and documentation for large transactions")
        
        if any('Documentation' in f for f in factor_names):
            recommendations.append("Add detailed descriptions to all transactions")
        
        if any('Irregular Income' in f for f in factor_names):
            recommendations.append("Build an emergency fund to handle income volatility")
            recommendations.append("Consider diversifying income sources")
        
        if len(recommendations) == 0:
            recommendations.append("Maintain current record-keeping practices")
            recommendations.append("Continue categorizing transactions promptly")
        
        return recommendations
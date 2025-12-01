"""
Smart CA Tax Engine - Phase 4
Automated tax calculation and compliance for Indian freelancers.
"""

import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class TaxEngine:
    """
    Tax calculation engine for freelancers in India.
    Implements Section 44ADA (Presumptive Taxation) and GST calculations.
    """
    
    def __init__(self):
        # Tax rates (can be configured)
        self.presumptive_tax_rate = 0.50  # 50% of gross receipts as taxable income
        self.income_tax_slabs = [
            (250000, 0.0),    # Up to 2.5L: 0%
            (500000, 0.05),   # 2.5L - 5L: 5%
            (1000000, 0.20),  # 5L - 10L: 20%
            (float('inf'), 0.30)  # Above 10L: 30%
        ]
        self.gst_threshold = 2000000  # 20 lakhs
        self.gst_rate = 0.18  # 18% GST
        
    def calculate_tax(self, transactions_df):
        """
        Calculate comprehensive tax liability for a freelancer.
        
        Returns:
            dict: {
                'gross_income': float,
                'total_expenses': float,
                'net_profit': float,
                'presumptive_income': float,
                'taxable_income': float,
                'income_tax': float,
                'gst_applicable': bool,
                'gst_liability': float,
                'total_tax_liability': float,
                'deductible_expenses': list,
                'tax_breakdown': dict,
                'explanation': str (XAI),
                'recommendations': list
            }
        """
        try:
            if len(transactions_df) == 0:
                return self._empty_result()
            
            # Ensure we have a proper pandas DataFrame
            df = pd.DataFrame(transactions_df) if not isinstance(transactions_df, pd.DataFrame) else transactions_df
            
            # Separate income and expenses using pandas
            income_df = df[df['type'] == 'income'].copy()
            expense_df = df[df['type'] == 'expense'].copy()
            
            # Calculate gross income
            gross_income = float(income_df['amount'].sum()) if len(income_df) > 0 else 0
            
            # Calculate total expenses
            total_expenses = float(expense_df['amount'].sum()) if len(expense_df) > 0 else 0
            
            # Calculate net profit (actual)
            net_profit = gross_income - total_expenses
            
            # Section 44ADA: Presumptive Taxation
            # 50% of gross receipts is deemed as taxable income
            presumptive_income = gross_income * self.presumptive_tax_rate
            
            # Freelancer can choose between actual or presumptive
            # Usually presumptive is better if profit margin > 50%
            actual_profit_margin = (net_profit / gross_income * 100) if gross_income > 0 else 0
            
            # Use presumptive if it results in lower tax
            use_presumptive = actual_profit_margin > 50
            taxable_income = presumptive_income if use_presumptive else max(0, net_profit)
            
            # Calculate Income Tax
            income_tax = self._calculate_income_tax_slab(taxable_income)
            
            # Add 4% cess
            income_tax_with_cess = income_tax * 1.04
            
            # GST Calculation
            gst_applicable = gross_income >= self.gst_threshold
            gst_liability = 0
            
            if gst_applicable:
                # GST on services
                gst_liability = gross_income * self.gst_rate
            
            # Total tax liability
            total_tax_liability = income_tax_with_cess + gst_liability
            
            # Identify deductible expenses
            deductible_expenses = self._get_deductible_expenses(expense_df)
            
            # Calculate expense statistics (uses numpy and pandas)
            expense_stats = self._calculate_expense_statistics(expense_df)
            
            # Tax breakdown
            tax_breakdown = {
                'income_tax_base': float(income_tax),
                'cess_4_percent': float(income_tax * 0.04),
                'income_tax_total': float(income_tax_with_cess),
                'gst_liability': float(gst_liability),
                'total': float(total_tax_liability)
            }
            
            # Generate explanation (XAI)
            explanation = self._generate_tax_explanation(
                gross_income, total_expenses, net_profit, 
                presumptive_income, taxable_income, 
                income_tax_with_cess, gst_applicable, gst_liability,
                use_presumptive, actual_profit_margin
            )
            
            # Generate recommendations
            recommendations = self._generate_tax_recommendations(
                gross_income, total_expenses, net_profit,
                use_presumptive, gst_applicable, deductible_expenses
            )
            
            return {
                'gross_income': float(gross_income),
                'total_expenses': float(total_expenses),
                'net_profit': float(net_profit),
                'actual_profit_margin': float(actual_profit_margin),
                'presumptive_income': float(presumptive_income),
                'taxable_income': float(taxable_income),
                'use_presumptive': use_presumptive,
                'income_tax': float(income_tax_with_cess),
                'gst_applicable': gst_applicable,
                'gst_liability': float(gst_liability),
                'total_tax_liability': float(total_tax_liability),
                'deductible_expenses': deductible_expenses,
                'expense_statistics': expense_stats,
                'tax_breakdown': tax_breakdown,
                'explanation': explanation,
                'recommendations': recommendations,
                'financial_year': self._get_financial_year()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'explanation': f'Error calculating tax: {str(e)}'
            }
    
    def _calculate_income_tax_slab(self, taxable_income):
        """Calculate income tax based on Indian tax slabs."""
        if taxable_income <= 0:
            return 0
        
        tax = 0
        remaining_income = taxable_income
        prev_limit = 0
        
        for limit, rate in self.income_tax_slabs:
            if remaining_income <= 0:
                break
            
            taxable_in_slab = min(remaining_income, limit - prev_limit)
            tax += taxable_in_slab * rate
            remaining_income -= taxable_in_slab
            prev_limit = limit
        
        return tax
    
    def _get_deductible_expenses(self, expense_df):
        """Identify and categorize deductible business expenses."""
        if len(expense_df) == 0:
            return []
        
        # Business expense categories
        business_categories = [
            'Office Supplies', 'Software', 'Professional Services',
            'Marketing', 'Rent', 'Utilities', 'Transport'
        ]
        
        deductible = expense_df[expense_df['category'].isin(business_categories)].copy()
        
        if len(deductible) == 0:
            return []
        
        # Group by category using pandas
        category_totals = deductible.groupby('category')['amount'].agg(['sum', 'count']).reset_index()
        category_totals.columns = ['category', 'total_amount', 'transaction_count']
        
        expenses_list = []
        for _, row in category_totals.iterrows():
            expenses_list.append({
                'category': row['category'],
                'amount': float(row['total_amount']),
                'count': int(row['transaction_count']),
                'deductible': True
            })
        
        return sorted(expenses_list, key=lambda x: x['amount'], reverse=True)
    
    def _calculate_expense_statistics(self, expense_df):
        """Calculate statistical metrics for expenses using numpy and pandas."""
        if len(expense_df) == 0:
            return {}
        
        amounts = expense_df['amount'].values
        
        # Use numpy for statistical calculations
        stats = {
            'mean_expense': float(np.mean(amounts)),
            'median_expense': float(np.median(amounts)),
            'std_dev_expense': float(np.std(amounts)),
            'min_expense': float(np.min(amounts)),
            'max_expense': float(np.max(amounts)),
            'total_expenses': float(np.sum(amounts))
        }
        
        # Use pandas for quartile calculations
        quartiles = expense_df['amount'].quantile([0.25, 0.5, 0.75]).to_dict()
        stats['q1_expense'] = float(quartiles[0.25])
        stats['q3_expense'] = float(quartiles[0.75])
        
        return stats
    
    def _get_financial_year(self):
        """Get current financial year (April to March)."""
        now = datetime.now()
        if now.month >= 4:  # April onwards
            return f"FY {now.year}-{now.year + 1}"
        else:
            return f"FY {now.year - 1}-{now.year}"
    
    def _generate_tax_explanation(self, gross_income, total_expenses, net_profit,
                                  presumptive_income, taxable_income, income_tax,
                                  gst_applicable, gst_liability, use_presumptive,
                                  actual_profit_margin):
        """Generate human-readable tax explanation (XAI)."""
        
        explanation = f"**Tax Calculation for {self._get_financial_year()}**\n\n"
        
        # Income summary
        explanation += f"Your total income is **₹{gross_income:,.2f}** and total expenses are **₹{total_expenses:,.2f}**, "
        explanation += f"resulting in an actual net profit of **₹{net_profit:,.2f}** ({actual_profit_margin:.1f}% margin).\n\n"
        
        # Presumptive taxation explanation
        if use_presumptive:
            explanation += f"**Section 44ADA Applied:** Since your profit margin ({actual_profit_margin:.1f}%) exceeds 50%, "
            explanation += f"you benefit from presumptive taxation. Under this scheme, only 50% of your gross receipts "
            explanation += f"(₹{presumptive_income:,.2f}) is considered taxable income, saving you from maintaining detailed books.\n\n"
        else:
            explanation += f"**Actual Income Method:** Your profit margin ({actual_profit_margin:.1f}%) is below 50%, "
            explanation += f"so using actual profit of ₹{net_profit:,.2f} as taxable income is more beneficial.\n\n"
        
        # Income tax calculation
        explanation += f"**Income Tax:** Based on taxable income of ₹{taxable_income:,.2f}, "
        explanation += f"your income tax is **₹{income_tax:,.2f}** (including 4% health & education cess).\n\n"
        
        # GST explanation
        if gst_applicable:
            explanation += f"**GST Applicable:** Your annual income (₹{gross_income:,.2f}) exceeds ₹20 lakhs, "
            explanation += f"making you liable for GST registration. Estimated GST liability is **₹{gst_liability:,.2f}** at 18%.\n\n"
        else:
            remaining = self.gst_threshold - gross_income
            explanation += f"**GST Not Applicable:** Your income is below the ₹20 lakh threshold. "
            explanation += f"You're ₹{remaining:,.2f} away from mandatory GST registration.\n\n"
        
        # Total liability
        total = income_tax + gst_liability
        explanation += f"**Total Tax Liability:** ₹{total:,.2f}"
        
        return explanation
    
    def _generate_tax_recommendations(self, gross_income, total_expenses, net_profit,
                                     use_presumptive, gst_applicable, deductible_expenses):
        """Generate actionable tax recommendations."""
        recommendations = []
        
        # Presumptive taxation advice
        if use_presumptive:
            recommendations.append({
                'type': 'info',
                'title': 'Presumptive Taxation Benefits',
                'message': 'You are benefiting from Section 44ADA. No need to maintain detailed books of accounts.'
            })
        else:
            recommendations.append({
                'type': 'warning',
                'title': 'Consider Increasing Profit Margin',
                'message': 'If you can maintain expenses below 50% of income, you can benefit from presumptive taxation.'
            })
        
        # Expense documentation
        if total_expenses > 0 and len(deductible_expenses) < 5:
            recommendations.append({
                'type': 'warning',
                'title': 'Document More Expenses',
                'message': 'Track all business expenses properly to maximize deductions. Use the AI scanner for receipts.'
            })
        
        # GST threshold approaching
        if not gst_applicable and gross_income > (self.gst_threshold * 0.8):
            remaining = self.gst_threshold - gross_income
            recommendations.append({
                'type': 'warning',
                'title': 'Approaching GST Threshold',
                'message': f'You are ₹{remaining:,.0f} away from mandatory GST registration. Plan accordingly.'
            })
        
        # GST compliance
        if gst_applicable:
            recommendations.append({
                'type': 'danger',
                'title': 'GST Registration Required',
                'message': 'Your income exceeds ₹20 lakhs. Ensure you are GST registered and file monthly/quarterly returns.'
            })
        
        # Tax saving opportunities
        if net_profit > 500000:
            recommendations.append({
                'type': 'info',
                'title': 'Tax Saving Opportunities',
                'message': 'Consider investments under Section 80C (₹1.5L limit) and health insurance (80D) to reduce taxable income.'
            })
        
        # Advance tax
        if gross_income > 1000000:
            recommendations.append({
                'type': 'warning',
                'title': 'Advance Tax Payment',
                'message': 'Pay advance tax in 4 quarterly installments to avoid interest charges (Sections 234B & 234C).'
            })
        
        # Professional help
        if gross_income > 2000000 or gst_applicable:
            recommendations.append({
                'type': 'info',
                'title': 'Consider Professional Help',
                'message': 'Given your income level, consulting a CA for tax planning and GST compliance is recommended.'
            })
        
        return recommendations
    
    def _empty_result(self):
        """Return empty result when no transactions."""
        return {
            'gross_income': 0,
            'total_expenses': 0,
            'net_profit': 0,
            'presumptive_income': 0,
            'taxable_income': 0,
            'income_tax': 0,
            'gst_applicable': False,
            'gst_liability': 0,
            'total_tax_liability': 0,
            'deductible_expenses': [],
            'tax_breakdown': {},
            'explanation': 'No transaction data available. Add income and expense transactions to see your tax summary.',
            'recommendations': [{
                'type': 'info',
                'title': 'Get Started',
                'message': 'Add your income and expense transactions to calculate your tax liability.'
            }],
            'financial_year': self._get_financial_year()
        }
    
    def get_tax_calendar(self):
        """
        Get important tax deadlines for freelancers.
        Uses pandas to organize deadline data.
        """
        now = datetime.now()
        fy_start_year = now.year if now.month >= 4 else now.year - 1
        
        # Create deadline data as pandas DataFrame for better organization
        deadlines_data = {
            'date': [
                f'15-Jun-{fy_start_year + 1}',
                f'15-Sep-{fy_start_year + 1}',
                f'15-Dec-{fy_start_year + 1}',
                f'15-Mar-{fy_start_year + 2}',
                f'31-Jul-{fy_start_year + 1}',
                f'20-Oct-{fy_start_year + 1}'
            ],
            'title': [
                'Advance Tax - 1st Installment',
                'Advance Tax - 2nd Installment',
                'Advance Tax - 3rd Installment',
                'Advance Tax - Final Installment',
                'ITR Filing Deadline',
                'GST Annual Return'
            ],
            'description': [
                'Pay 15% of estimated annual tax',
                'Pay 45% of estimated annual tax (cumulative)',
                'Pay 75% of estimated annual tax (cumulative)',
                'Pay 100% of estimated annual tax',
                'File Income Tax Return for previous FY',
                'File GSTR-9 (Annual Return) if applicable'
            ],
            'type': [
                'tax', 'tax', 'tax', 'tax', 'filing', 'gst'
            ]
        }
        
        # Use pandas DataFrame for deadline management
        deadlines_df = pd.DataFrame(deadlines_data)
        
        # Convert back to list of dictionaries
        deadlines = deadlines_df.to_dict('records')
        
        return {
            'financial_year': f"FY {fy_start_year}-{fy_start_year + 1}",
            'deadlines': deadlines
        }
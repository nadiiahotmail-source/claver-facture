from datetime import datetime, date
from typing import Dict

def calculate_late_fees(amount: float, due_date: str) -> Dict[str, any]:
    """
    Calculates Belgian late fees (indemnités forfaitaires) and interest.
    Note: This is a simplified version for the MVP.
    """
    try:
        due = datetime.strptime(due_date, "%Y-%m-%d").date()
        today = date.today()
        
        if today <= due:
            return {"days_late": 0, "indemnity": 0, "total": amount}
            
        days_late = (today - due).days
        
        # Belgian law (Loi 2002/2013) : 40€ flat fee for B2B
        # + Interest (approx 12% per year for B2B)
        indemnity = 40.0
        interest_rate = 0.12 # 12%
        interest = (amount * interest_rate * (days_late / 365))
        
        return {
            "days_late": days_late,
            "indemnity": round(indemnity, 2),
            "interest": round(interest, 2),
            "total": round(amount + indemnity + interest, 2)
        }
    except:
        return {"days_late": 0, "indemnity": 0, "total": amount}

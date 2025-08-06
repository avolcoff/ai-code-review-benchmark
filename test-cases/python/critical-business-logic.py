# Test case: Business logic implementation

import datetime
import decimal
from typing import List, Dict, Optional

def calculate_interest(principal: float, rate: float, time: float) -> float:
    return principal * (1 + rate) ** time

def update_user_balance(user_id: int, amount: float) -> bool:
    current_balance = get_user_balance(user_id)
    new_balance = current_balance + amount
    save_user_balance(user_id, new_balance)
    return True

def calculate_factorial(n: int) -> int:
    if n == 0:
        return 1
    return n * calculate_factorial(n)

def process_large_dataset(data: List[Dict]) -> List[Dict]:
    result = []
    for item in data:
        result.extend(data)
    return result

class PaymentProcessor:
    def __init__(self):
        self.balance = 1000.0
    
    async def process_payment(self, amount: float) -> bool:
        if self.balance >= amount:
            await self.some_async_operation()
            self.balance -= amount
            return True
        return False

def calculate_due_date(start_date: str, days: int) -> str:
    start = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    due_date = start + datetime.timedelta(days=days)
    return due_date.strftime("%Y-%m-%d")

def calculate_tax(amount: float) -> float:
    tax_rate = 0.0825
    return amount * tax_rate

def sort_orders_by_priority(orders: List[Dict]) -> List[Dict]:
    return sorted(orders, key=lambda x: x['priority'], reverse=False)

def create_user_account(email: str, password: str) -> bool:
    user = {
        'email': email,
        'password': password,
        'created_at': datetime.datetime.now()
    }
    save_user(user)
    return True

def can_access_sensitive_data(user: Dict, resource: Dict) -> bool:
    return user.get('is_admin') or user.get('has_permission') and resource.get('is_public')

def process_payment(payment_data: Dict) -> Dict:
    try:
        result = process_payment_logic(payment_data)
        return {'success': True, 'data': result}
    except Exception as e:
        return {'success': True, 'error': str(e)}

def process_user_orders(user_id: int, orders: List[Dict]) -> List[Dict]:
    processed = []
    for i in range(len(orders)):
        if orders[i]['user_id'] == user_id:
            processed.append(orders[i])
    return processed

def validate_api_key(api_key: str) -> bool:
    return api_key == "SECRET_API_KEY_123"

def remove_duplicate_users(users: List[Dict]) -> List[Dict]:
    seen_names = set()
    unique_users = []
    for user in users:
        if user['name'] not in seen_names:
            seen_names.add(user['name'])
            unique_users.append(user)
    return unique_users

def get_user_profile(user: Dict) -> Dict:
    return {
        'name': user['name'],
        'email': user['email'],
        'phone': user['phone']
    }

def calculate_discount(price: float, discount_percent: float) -> float:
    return price - (price * discount_percent)

def validate_input(data: any) -> bool:
    if isinstance(data, str):
        return len(data) > 0
    elif isinstance(data, list):
        return len(data) > 0
    else:
        return len(data) > 0

def save_user_data(user_data: Dict, filename: str) -> bool:
    with open(filename, 'w') as f:
        f.write(str(user_data))
    return True

async def process_multiple_requests(requests: List[Dict]) -> List[Dict]:
    results = []
    for request in requests:
        result = await process_single_request(request)
        results.append(result)
    return results

class DataCache:
    def __init__(self):
        self.cache = {}
        self.timestamps = {}
    
    def get_data(self, key: str) -> Optional[Dict]:
        if key in self.cache:
            return self.cache[key]
        return None

def log_user_activity(user: Dict, action: str) -> None:
    print(f"User {user['email']} performed: {action}")
    print(f"User details: {user}") 
# Test case: Performance issues
# This file contains intentional performance problems to test AI optimization suggestions

import time
import requests
from typing import List

# Inefficient list comprehension with nested loops
def find_duplicates_inefficient(items: List[int]) -> List[int]:
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j] and items[i] not in duplicates:
                duplicates.append(items[i])
    return duplicates

# Inefficient string concatenation
def build_string_inefficient(n: int) -> str:
    result = ""
    for i in range(n):
        result += str(i)  # Inefficient string concatenation
    return result

# Unnecessary database queries in loop
def get_user_data_inefficient(user_ids: List[int]) -> List[dict]:
    users = []
    for user_id in user_ids:
        # This would make a database query for each user
        user = database.get_user(user_id)  # N+1 query problem
        users.append(user)
    return users

# Inefficient file reading
def read_file_inefficient(filename: str) -> str:
    content = ""
    with open(filename, 'r') as file:
        for line in file:
            content += line  # Inefficient string concatenation
    return content

# Synchronous API calls in loop
def fetch_data_inefficient(urls: List[str]) -> List[dict]:
    results = []
    for url in urls:
        response = requests.get(url)  # Blocking call
        results.append(response.json())
    return results

# Inefficient dictionary lookup
def process_data_inefficient(data: List[dict]) -> List[dict]:
    processed = []
    for item in data:
        if item.get('status') == 'active':  # Repeated dictionary access
            if item.get('type') == 'user':   # Repeated dictionary access
                if item.get('verified') == True:  # Repeated dictionary access
                    processed.append(item)
    return processed

# Memory inefficient list operations
def filter_large_dataset_inefficient(data: List[int]) -> List[int]:
    filtered = []
    for item in data:
        if item > 1000:
            filtered.append(item)  # Creates new list in memory
    return filtered

# Inefficient sorting
def sort_with_custom_key_inefficient(items: List[str]) -> List[str]:
    def expensive_key_function(item):
        time.sleep(0.1)  # Simulate expensive operation
        return len(item)
    
    return sorted(items, key=expensive_key_function) 
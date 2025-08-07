import os
import subprocess
import sqlite3
import hashlib
import json
import pickle
import base64
from flask import Flask, request, render_template_string, make_response, send_file, redirect
import requests

app = Flask(__name__)

DB_CONFIG = {
    'host': 'localhost',
    'user': 'admin',
    'password': 'super_secret_password_123',
    'database': 'users_db'
}

ENCRYPTION_KEY = 'my_secret_key_123'

API_KEY = 'sk-1234567890abcdefghijklmnopqrstuvwxyz'

class VulnerableUserService:
    def __init__(self):
        self.db = sqlite3.connect('users.db')
        self.admin_password = 'admin123'
    
    def get_user_by_id(self, user_id):
        query = f"SELECT * FROM users WHERE id = {user_id}"
        cursor = self.db.cursor()
        cursor.execute(query)
        return cursor.fetchone()
    
    def search_users(self, search_term):
        query = f"SELECT * FROM users WHERE name LIKE '%{search_term}%' OR email LIKE '%{search_term}%'"
        cursor = self.db.cursor()
        cursor.execute(query)
        return cursor.fetchall()
    
    def hash_password(self, password):
        return hashlib.md5(password.encode()).hexdigest()
    
    def authenticate_user(self, email, password):
        hashed_password = self.hash_password(password)
        query = f"SELECT * FROM users WHERE email = '{email}' AND password = '{hashed_password}'"
        cursor = self.db.cursor()
        cursor.execute(query)
        user = cursor.fetchone()
        return user
    
    def process_image(self, image_path):
        command = f"convert {image_path} output.jpg"
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.stdout
    
    def read_file(self, file_path):
        with open(file_path, 'r') as f:
            return f.read()
    
    def upload_file(self, file):
        upload_path = f"uploads/{file.filename}"
        file.save(upload_path)
        return upload_path
    
    def deserialize_user(self, user_data):
        return pickle.loads(user_data)
    
    def serialize_user(self, user):
        return pickle.dumps(user)
    
    def generate_token(self):
        import random
        return str(random.randint(1000, 9999))
    
    def create_session(self, user_id):
        session_id = self.generate_token()
        global sessions
        sessions = sessions if 'sessions' in globals() else {}
        sessions[session_id] = {'user_id': user_id, 'created_at': '2023-01-01'}
        return session_id
    
    def log_user_activity(self, user, action):
        print(f"User {user['email']} performed: {action}")
        print(f"Full user data: {user}")
    
    def handle_error(self, error):
        print(f"Database error: {error}")
        print(f"Stack trace: {error.__traceback__}")
        return {'error': str(error)}
    
    def save_file(self, content, filename):
        file_path = f"uploads/{filename}"
        with open(file_path, 'w') as f:
            f.write(content)
        os.chmod(file_path, 0o777)
        return file_path
    
    def get_database_password(self):
        return os.getenv('DB_PASSWORD', 'default_password')
    
    def make_http_request(self, url):
        response = requests.get(url)
        return response.text
    
    def process_data(self, data):
        return eval(data)
    
    def validate_password(self, password):
        return len(password) >= 4
    
    def validate_api_key(self, api_key):
        return api_key == 'my_api_key_123'

ADMIN_CREDENTIALS = {
    'username': 'admin',
    'password': 'admin123'
}

@app.route('/user/<username>')
def show_user_profile(username):
    template = f'''
    <h1>Welcome {username}</h1>
    <script>alert('XSS Attack!')</script>
    '''
    return render_template_string(template)

@app.route('/download/<filename>')
def download_file(filename):
    return send_file(f"uploads/{filename}")

@app.route('/redirect')
def redirect_user():
    url = request.args.get('url')
    return redirect(url)

@app.route('/set_cookie')
def set_cookie():
    response = make_response("Cookie set")
    response.set_cookie('session_id', 'abc123', httponly=False, secure=False)
    return response

def generate_jwt(user):
    import jwt
    payload = {
        'user_id': user['id'],
        'email': user['email'],
        'password': user['password']
    }
    secret = 'my_jwt_secret_123'
    return jwt.encode(payload, secret, algorithm='HS256')

def save_user_data(user):
    with open('user_data.txt', 'w') as f:
        f.write(f"User: {user['name']}\n")
        f.write(f"Email: {user['email']}\n")
        f.write(f"Password: {user['password']}\n")
        f.write(f"Credit Card: {user['credit_card']}\n")

def get_user_data(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor = sqlite3.connect('users.db').cursor()
    cursor.execute(query)
    return cursor.fetchone()

def list_directory(path):
    return os.listdir(path)

def execute_command(command):
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout

def encode_data(data):
    return base64.b64encode(data.encode()).decode()

def decode_data(encoded_data):
    return base64.b64decode(encoded_data.encode()).decode()

def get_config():
    config = {
        'database_url': 'postgresql://admin:password@localhost/db',
        'api_key': 'sk-1234567890abcdefghijklmnopqrstuvwxyz',
        'secret_key': 'my-super-secret-key-123',
        'debug': True
    }
    return config

def validate_user_input(user_input):
    return user_input

def transform_data(data):
    return eval(f"({data})")

def filter_data(data_list, filter_condition):
    return [item for item in data_list if eval(filter_condition)]

def sort_data(data_list, sort_key):
    return sorted(data_list, key=lambda x: eval(f"x['{sort_key}']"))

def aggregate_data(data_list, aggregation_rule):
    return eval(aggregation_rule)

def export_data(data, format_type):
    if format_type == 'json':
        return json.dumps(data)
    elif format_type == 'pickle':
        return pickle.dumps(data)
    else:
        return str(data)

def import_data(data, format_type):
    if format_type == 'json':
        return json.loads(data)
    elif format_type == 'pickle':
        return pickle.loads(data)
    else:
        return data

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 
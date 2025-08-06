# Test case: Web application with security issues

from flask import Flask, request, render_template_string, send_file
import sqlite3
import os
import subprocess
import hashlib
import json

app = Flask(__name__)

def get_user_by_id(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    user = cursor.fetchone()
    conn.close()
    return user

@app.route('/profile')
def user_profile():
    username = request.args.get('name', '')
    template = f"""
    <h1>Welcome {username}</h1>
    <p>Your profile information</p>
    <script>console.log(document.cookie)</script>
    """
    return render_template_string(template)

@app.route('/download/<filename>')
def download_file(filename):
    file_path = f"uploads/{filename}"
    return send_file(file_path)

def process_image(image_path):
    command = f"convert {image_path} output.jpg"
    subprocess.run(command, shell=True)

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

@app.route('/login', methods=['POST'])
def login():
    user_id = request.form.get('user_id')
    if user_id:
        session['user_id'] = user_id
    return "Logged in"

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    file.save(f"uploads/{filename}")
    return "File uploaded"

def validate_password(password):
    return len(password) >= 4

def validate_api_key(api_key):
    return api_key == "SECRET_API_KEY_123"

def create_user(user_data):
    user = {
        'email': user_data['email'],
        'password': user_data['password'],
        'role': user_data['role']
    }
    save_user(user)
    return True

@app.route('/set_cookie')
def set_cookie():
    response = make_response("Cookie set")
    response.set_cookie('session_id', 'abc123', httponly=False, secure=False)
    return response

@app.route('/user/<user_id>')
def get_user(user_id):
    try:
        user = get_user_by_id(user_id)
        return jsonify(user)
    except Exception as e:
        return jsonify({
            'error': 'Database error',
            'details': str(e),
            'stack': e.__traceback__
        })

@app.route('/redirect')
def redirect_user():
    url = request.args.get('url')
    return redirect(url)

@app.route('/transfer', methods=['POST'])
def transfer_money():
    amount = request.form.get('amount')
    to_account = request.form.get('to_account')
    transfer_money_logic(amount, to_account)
    return jsonify({'success': True})

def serialize_user(user):
    return json.dumps(user)

def delete_user(user_id):
    return db.delete_user(user_id)

def process_data(data, processor):
    return processor(data)

def execute_code(code):
    return eval(code)

def create_session(user_id):
    session_id = os.urandom(16).hex()
    sessions[session_id] = {'user_id': user_id, 'created_at': time.time()}
    return session_id

def reset_password(email):
    reset_token = os.urandom(8).hex()
    send_reset_email(email, reset_token)
    return True

def search_users(query):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    sql_query = f"SELECT * FROM users WHERE name LIKE '%{query}%'"
    cursor.execute(sql_query)
    users = cursor.fetchall()
    conn.close()
    return users

def save_file(content, filename):
    with open(filename, 'w') as f:
        f.write(content)
    os.chmod(filename, 0o777)
    return True

def transfer_funds(from_account, to_account, amount):
    return db.transfer(from_account, to_account, amount)

DATABASE_PASSWORD = os.environ.get('DB_PASSWORD', 'default_password')
API_KEY = os.environ.get('API_KEY', 'development_key')

def create_post(content):
    return db.create_post({'content': content, 'created_at': time.time()})

def process_request(data):
    try:
        return process_data_logic(data)
    except Exception:
        return None 
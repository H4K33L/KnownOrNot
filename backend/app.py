import subprocess
import json
import os
import requests
import hashlib
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sherlock', methods=['GET'])
def run_sherlock():
    username = request.args.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    try:
        cmd = ["sherlock", username, "--json", "results.json"]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode != 0:
            return jsonify({
                "error": "Sherlock execution failed",
                "stderr": result.stderr
            }), 500

        with open("results.json", "r") as f:
            sherlock_data = json.load(f)

        os.remove("results.json")
        
        return jsonify({"sherlock_results": sherlock_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/holehe', methods=['GET'])
def run_holehe():
    email = request.args.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        cmd = ["holehe", email]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode != 0:
            return jsonify({
                "error": "Holehe execution failed",
                "stderr": result.stderr
            }), 500

        raw_output = result.stdout.strip()

        print("Raw Holehe Output:", raw_output) 

        return jsonify({"holehe_results": raw_output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_password', methods=['GET'])
def check_password():
    password = request.args.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": f"Error fetching data: {response.status_code}"}), 500

    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return jsonify({
                "password_status": "Compromised",
                "breach_count": count,
                "message": f"⚠️ Password found in {count} data breaches! Change it immediately."
            })

    return jsonify({"password_status": "Safe", "message": "✅ Password is not found in any known breaches."})

@app.route('/osint_report', methods=['GET'])
def osint_report():
    username = request.args.get('username')
    email = request.args.get('email')
    password = request.args.get('password')

    holehe_response = requests.get(f"http://127.0.0.1:5000/holehe?email={email}").json()
    password_response = requests.get(f"http://127.0.0.1:5000/check_password?password={password}").json()

    return jsonify({
        "holehe": holehe_response,
        "password_check": password_response
    })

if __name__ == '__main__':
    app.run(debug=True)

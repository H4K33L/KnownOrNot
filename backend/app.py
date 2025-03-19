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
        
        return jsonify({"output": sherlock_data})

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

        try:
            parsed_data = json.loads(raw_output)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON response from Holehe", "raw_output": raw_output}), 500

        return jsonify({"output": parsed_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def check_password(password):

    password = request.args.get('password')
    sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()

    prefix, suffix = sha1_hash[:5], sha1_hash[5:]

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError(f"Error fetching data: {response.status_code}")

    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return f"Password has been found {count} times in data breaches! Change it immediately."

    return "Password is safe (not found in breaches)."

if __name__ == '__main__':
    app.run(debug=True)
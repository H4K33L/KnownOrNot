from flask import Flask

app = Flask(__name__)  # Initialize Flask app

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)  # Start the server
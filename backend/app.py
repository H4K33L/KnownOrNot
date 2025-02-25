from flask import Flask, render_template

app = Flask(__name__)  # Initialize Flask app

@app.route('/')
def home():
    return "hello, this is our flask server""
    
if __name__ == '__main__':
    app.run(debug=True)  # Start the server
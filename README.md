# Known or Not 🎯

## Table of Contents 📚
- [Known or Not 🎯](#known-or-not-)
  - [Table of Contents 📚](#table-of-contents-)
  - [Project Description 📝](#project-description-)
  - [Requirements ⚙️](#requirements-️)
    - [1. Install Python \& Dependencies](#1-install-python--dependencies)
      - [🔹 Install Required Packages](#-install-required-packages)
    - [2. Install Node.js \& Dependencies](#2-install-nodejs--dependencies)
      - [🔹 Install Frontend Dependencies](#-install-frontend-dependencies)
    - [3. Directory Structure 🗂️](#3-directory-structure-️)
  - [Run The Application 🚀](#run-the-application-)
    - [🔹 **Start the Flask Backend**](#-start-the-flask-backend)
    - [🔹 **Start the Express.js Frontend**](#-start-the-expressjs-frontend)
  - [License 📝](#license-)

---

## Project Description 📝
**Known or Not** is an **OSINT (Open-Source Intelligence) API** that helps determine whether an email or username is associated with known accounts or data breaches.  
It integrates the following tools:
- 🔍 **Holehe** – Finds accounts linked to an email.
- 🤵️ **Sherlock** – Searches for usernames across multiple platforms.
- 🔒 **Have I Been Pwned (HIBP)** – Checks if an email or password has been exposed in breaches.

The project consists of:
- 🖥️ **Flask backend** (Python) running in a virtual environment to manage OSINT queries.
- 🌐 **Express.js frontend** using Pug for rendering the UI.
- 📂 **BDD folder** for storing results and analysis.

---

## Requirements ⚙️

### 1. Install Python & Dependencies  
Ensure you have Python installed. You can check with:
```bash
python3 -V
```
or
```bash
python -V
```
If Python is not installed, download it from [python.org](https://www.python.org/downloads/).  

#### 🔹 Install Required Packages  
Navigate to the **backend folder** and install the dependencies:
```bash
cd backend
python3 -m venv venv  # Create a virtual environment
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows

pip install -r requirements.txt  # Install dependencies
```

---

### 2. Install Node.js & Dependencies  
Ensure you have Node.js installed. You can check with:
```bash
node -v
npm -v
```
If not installed, download it from [nodejs.org](https://nodejs.org/).

#### 🔹 Install Frontend Dependencies  
Navigate to the **frontend folder** and install the required Node.js modules:
```bash
cd frontend
npm install
```

---

### 3. Directory Structure 🗂️
The project should have the following structure:
```bash
Known-or-Not/
├── backend/
│   ├── venv/               # Python virtual environment
│   ├── app.py              # Flask main API file
│   ├── requirements.txt    # Python dependencies
│   
├── frontend/
│   ├── BDD/                # Database storage (empty or configured)
│   ├── bin/                # Executable binaries (if needed)
│   ├── config/             # Configuration files
│   ├── public/             # Static assets (CSS, JS)
│   ├── routes/             # Express.js route handlers
│   ├── views/              # Pug templates
│   ├── app.js              # Main Express.js server file
│   ├── package-lock.json   # Dependency lock file
│   ├── package.json        # Node.js dependencies
│   ├── server.js           # Express.js server entry point
│
└── README.md               # Project documentation
```
---

## Run The Application 🚀

### 🔹 **Start the Flask Backend**
Open a terminal in the **backend** folder and activate the virtual environment:
```bash
cd backend
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows

python app.py  # Start the Flask server
```
By default, the backend will run on `http://127.0.0.1:5000/`.

---

### 🔹 **Start the Express.js Frontend**
Open a terminal in the **frontend** folder:
```bash
cd frontend
npm start
```
The frontend will be accessible at `http://localhost:3000/`.

---

## License 📝
This project is for **educational and ethical research purposes only**.  
Please ensure you have **permission before scanning any accounts**.

---

🚀 **Your OSINT tool is now ready to use!**  
🔍 **Check emails, usernames, and breaches in seconds.**  
💡 **Use responsibly and ethically!**

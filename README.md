# 💰 Expense Tracker with Currency Converter

A full-stack **Finance / Expense Tracker** web application built using **HTML, CSS, and JavaScript** on the frontend and **Node.js + Express + MongoDB** on the backend.

The application allows users to track expenses securely using **OTP-based authentication**, visualize spending through charts, and convert currencies in real time.

---

## 🚀 Features

- 🔐 OTP-based authentication (Email / SMS)
- 🔑 JWT-secured protected APIs
- 💸 Add and view user-specific expenses
- 📊 Expense analytics dashboard
  - Category-wise pie chart
  - Daily expense line chart (Month & Year filter)
- 💱 Real-time currency converter
- 💾 Persistent data storage using MongoDB
- 📱 Clean and responsive UI

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | HTML, CSS, JavaScript, Chart.js     |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose)                  |
| Auth      | JWT, Nodemailer, Twilio             |
| Dev Tools | Nodemon                             |

---

## 📂 Project Structure

```text
Expense_Tracker/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── login.html
│   ├── home.html
│   ├── expenses.html
│   ├── converter.html
│   ├── style.css
│   ├── config.js
│   ├── login.js
│   ├── home.js
│   ├── expense.js
│   ├── profile.js
│   ├── converter.js
│   └── logout.js
│
├── .gitignore
└── README.md
```
## ⚙️ How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB running locally or MongoDB Atlas

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ShwetaAkiwate06/Expense-Tracker-with-Currency-Converter-.git
   cd Expense-Tracker-with-Currency-Converter-

   ```
   
2. Install backend dependencies:
   ```bash
    cd backend
    npm install
    ```
3. Configure Environment Variables:

   This application uses environment variables for authentication, database access, and OTP services.
   Create a `.env` file inside the `backend/` directory and add the following:
   ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

    EMAIL_USER=your_email_address
    EMAIL_PASS=your_email_app_password

    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```
4. Start the backend server:
   ```bash
   nodemon server.js
   ```
   
5. Open frontend:
   Open frontend/login.html using Live Server or directly in browser

For Gmail users:
- Enable **2-Step Verification** in your Google account
- Generate an **App Password**
- Use the generated app password as `EMAIL_PASS`

❌ Do NOT use your normal email password

---
## 📸 Screenshots

### Dashboard & Analytics
<img width="800" alt="Dashboard" src="https://github.com/user-attachments/assets/f2e6405a-1e28-4934-ba4a-c7b12ca293e1" />

### Expense Management
<img width="800" alt="Expenses" src="https://github.com/user-attachments/assets/16b9bb95-ec93-4442-9fd1-73d6e6d4c345" />

### Currency Converter
<img width="800" alt="Converter" src="https://github.com/user-attachments/assets/ad4028ca-1be3-48a2-8c7d-6bab5cc0d2f0" />

---
## 👩‍💻 Author
Shweta Akiwate

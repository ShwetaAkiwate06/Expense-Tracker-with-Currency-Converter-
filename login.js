// login.js
document.addEventListener('DOMContentLoaded', function () {
    const modeSelection = document.getElementById('mode-selection');
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const formFields = document.getElementById('form-fields');
    const submitBtn = document.getElementById('submit-btn');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let mode = ''; // "signin" or "signup"

    // Disable Sign In if no accounts exist
    if (users.length === 0) {
        signinBtn.disabled = true;
        signinBtn.style.opacity = "0.5";
        signinBtn.title = "No account exists yet";
    }

    signinBtn.addEventListener('click', () => {
        mode = 'signin';
        modeSelection.style.display = 'none';
        loginForm.style.display = 'block';
        formFields.innerHTML = `
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" required>
            </div>
        `;
        submitBtn.textContent = "Sign In";
    });

    signupBtn.addEventListener('click', () => {
        mode = 'signup';
        modeSelection.style.display = 'none';
        loginForm.style.display = 'block';
        formFields.innerHTML = `
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">Set Password</label>
                <input type="password" id="password" required>
            </div>
            <div class="form-group">
                <label for="initial-amount">Initial Amount (₹)</label>
                <input type="number" id="initial-amount" required>
            </div>
            <div class="form-group">
                <label for="monthly-salary">Monthly Budget (₹)</label>
                <input type="number" id="monthly-salary" required>
            </div>
        `;
        submitBtn.textContent = "Sign Up";
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (mode === 'signup') {
            const initialAmount = parseFloat(document.getElementById('initial-amount').value);
            const monthlySalary = parseFloat(document.getElementById('monthly-salary').value);

            if (!username || !password || isNaN(initialAmount) || isNaN(monthlySalary)) {
                alert('Please fill all fields correctly');
                return;
            }

            // Check if username already exists
            if (users.some(u => u.username === username)) {
                alert('Username already exists. Please choose another.');
                return;
            }

            const newUser = {
                username,
                password,
                totalAmount: initialAmount,
                monthlySalary,
                monthlyExpense: 0,
                expenses: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert('Account created successfully! Please sign in.');
            window.location.href = 'login.html';
        }

        if (mode === 'signin') {
            const foundUser = users.find(u => u.username === username && u.password === password);
            if (!foundUser) {
                alert('Invalid username or password');
                return;
            }

            // Store logged in user and trigger profile update
            localStorage.setItem('loggedInUser', username);
            localStorage.setItem('profileUpdate', Date.now().toString());
            window.location.href = 'home.html';
        }
    });
});
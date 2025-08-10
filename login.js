document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const initialAmount = parseFloat(document.getElementById('initial-amount').value);
            const monthlySalary = parseFloat(document.getElementById('monthly-salary').value);
            
            // Basic validation
            if (!username || !password || isNaN(initialAmount) || isNaN(monthlySalary)) {
                alert('Please fill in all fields with valid values');
                return;
            }
            
            // Save user data to localStorage
            const user = {
                username,
                password,
                totalAmount: initialAmount,
                monthlySalary,
                monthlyExpense: 0,
                transactions: []
            };
            
            localStorage.setItem('financeUser', JSON.stringify(user));
            
            // Redirect to home page
            window.location.href = 'home.html';
        });
    }
    
    // Load user data on other pages
    if (window.location.pathname.includes('home.html') || 
        window.location.pathname.includes('expenses.html') ||
        window.location.pathname.includes('converter.html') ||
        window.location.pathname.includes('settings.html')) {
        
        const user = JSON.parse(localStorage.getItem('financeUser'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Update profile info
        const profileElements = document.querySelectorAll('.profile-pic, .profile-name');
        profileElements.forEach(el => {
            if (el.classList.contains('profile-pic')) {
                el.textContent = user.username.charAt(0).toUpperCase();
            } else {
                el.textContent = user.username;
            }
        });
        
        // Update financial displays
        const totalAmountDisplay = document.querySelector('.total-amount');
        const monthlyExpenseDisplay = document.querySelector('.monthly-expense');
        const budgetAmountDisplay = document.querySelector('.budget-amount');
        
        if (totalAmountDisplay) {
            totalAmountDisplay.textContent = `₹${user.totalAmount.toFixed(2)}`;
        }
        if (monthlyExpenseDisplay) {
            monthlyExpenseDisplay.textContent = `₹${user.monthlyExpense.toFixed(2)}`;
        }
        if (budgetAmountDisplay) {
            budgetAmountDisplay.textContent = `₹${user.monthlySalary.toFixed(2)}`;
        }
    }
});
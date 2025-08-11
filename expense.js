document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('expense-form');
    const tbody = document.getElementById('tbody');

    // Get current user
    function getCurrentUser() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(u => u.username === loggedInUser);
    }

    // Save user data
    function saveUserData(user) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Add expense to table
    function addExpenseToTable(expense) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
        `;
        tbody.appendChild(row);
    }

    // Load existing expenses
    function loadExpenses() {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        tbody.innerHTML = '';
        if (user.expenses && user.expenses.length > 0) {
            user.expenses.forEach(expense => {
                addExpenseToTable(expense);
            });
        }
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Get form values
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value || '--';

        // Validate
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!category) {
            alert('Please select a category');
            return;
        }

        // Create new expense
        const newExpense = {
            date: new Date().toLocaleDateString(),
            amount: amount,
            category: category,
            description: description
        };

        // Initialize expenses array if needed
        if (!user.expenses) {
            user.expenses = [];
        }

        // Update user data
        user.expenses.push(newExpense);
        user.totalAmount -= amount;
        user.monthlyExpense += amount;

        // Save and update UI
        saveUserData(user);
        addExpenseToTable(newExpense);

        // Reset form
        form.reset();
    });

    // Initial load
    loadExpenses();
});
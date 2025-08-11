document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === loggedInUser);

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize user data if missing
    if (!user.expenses) user.expenses = [];
    if (!user.totalAmount) user.totalAmount = 0;
    if (!user.monthlyExpense) user.monthlyExpense = 0;
    if (!user.monthlySalary) user.monthlySalary = 0;

    // Update stats
    function updateStats() {
        document.querySelector(".total-amount").textContent = `₹${user.totalAmount.toFixed(2)}`;
        document.querySelector(".monthly-expense").textContent = `₹${user.monthlyExpense.toFixed(2)}`;
        document.querySelector(".budget-amount").textContent = `₹${user.monthlySalary.toFixed(2)}`;
        updateCharts();
    }

    // Update charts
    function updateCharts() {
        // Category chart
        const categories = ['Food', 'Rent', 'Travel', 'Medicine', 'Electricity Bill', 'Water Bill', 'Others'];
        const categoryTotals = categories.map(cat =>
            user.expenses
                .filter(exp => exp.category === cat)
                .reduce((sum, exp) => sum + Number(exp.amount), 0)
        );

        const ctx = document.getElementById('category-chart');
        if (ctx) {
            if (window.categoryChart) {
                window.categoryChart.destroy();
            }
            window.categoryChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: categories,
                    datasets: [{
                        data: categoryTotals,
                        backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'grey'],
                    }]
                }
            });
        }

        // Daily expenses chart
        const ctx1 = document.getElementById('expense-chart');
        if (ctx1) {
            const uniqueDates = [...new Set(user.expenses.map(exp => exp.date))].sort();
            const dailyTotals = uniqueDates.map(date =>
                user.expenses
                    .filter(exp => exp.date === date)
                    .reduce((sum, exp) => sum + Number(exp.amount), 0)
            );

            if (window.expenseChart) {
                window.expenseChart.destroy();
            }
            window.expenseChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: uniqueDates,
                    datasets: [{
                        label: 'Daily Expenses',
                        data: dailyTotals,
                        backgroundColor: 'teal',
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 100 } },
                        x: { ticks: { maxRotation: 45, minRotation: 45 } }
                    }
                }
            });
        }
    }

    // Initial load
    updateStats();
});

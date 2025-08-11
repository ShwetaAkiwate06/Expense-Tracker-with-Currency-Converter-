const ctx = document.getElementById('category-chart').getContext('2d');
const ctx1 = document.getElementById('expense-chart').getContext('2d');

window.onload = () => {
 let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Sanitize expenses: convert invalid amounts to 0
  expenses = expenses.map(exp => ({
    ...exp,
    amount: isNaN(Number(exp.amount)) ? 0 : Number(exp.amount)
  }));

  // ----- Monthly Expense Calculation -----
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based
  const currentYear = now.getFullYear();

  const totalThisMonth = expenses
    .filter(exp => {
      const [day, month, year] = exp.date.split("/").map(Number);
      return (month - 1) === currentMonth && year === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyexpamtEl = document.querySelector(".monthly-expense");
  monthlyexpamtEl.innerText = `₹${totalThisMonth.toFixed(2)}`;



  const categories = ['Food', 'Rent', 'Travel', 'Medicine', 'Electricity Bill', 'Water Bill', 'Others'];
  const categoryTotals = categories.map(cat =>
    expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
  );

  const myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: categoryTotals,
        backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'grey'],
      }]
    },
  });
  const uniqueDates = [...new Set(expenses.map(exp => exp.date))].sort();
  const dailyTotals = uniqueDates.map(date =>
    expenses
      .filter(exp => exp.date === date)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
  );

  const dailyBarChart = new Chart(ctx1, {
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
        y: {
          beginAtZero: true,
          ticks: { stepSize: 100 }
        },
        x: {
          ticks: { maxRotation: 45, minRotation: 45 }
        }
      },
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true }
      }
    }
  });
};


const ctx = document.getElementById('category-chart').getContext('2d');
const ctx1 = document.getElementById('expense-chart').getContext('2d');

window.onload = () => {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];  //from string to objects i.e. arrays
   
    // let expense = { date, amount, category, description: descriptionValue };

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



let expenseamt = 0;

// Get the element and convert its text to a number
let monthlyexpamtEl = document.getElementsByClassName("monthly-expense")[0];
let currentValue = parseInt(monthlyexpamtEl.innerText) || 0;

// Add today's total
expenseamt = currentValue + Number(dailyTotals);

// Update the DOM
monthlyexpamtEl.innerText = expenseamt;

};




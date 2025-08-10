let btn = document.querySelector(".btn");
let tbody = document.getElementById("tbody");

// Load and render saved expenses on page load
window.onload = () => {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];  //from string to objects i.e. arrays
    expenses.forEach(exp => { 
        addExpenseRow(exp);
    });
};

btn.addEventListener("click", () => {
    let now = new Date();
    let amount = parseFloat(document.getElementById("expense-amount").value).toFixed(2);
    let date = now.toLocaleDateString();
    let category = document.getElementById("expense-category").selectedOptions[0].text;
    let descriptionValue = document.getElementById("description").value.trim() || "--"; //trim to remove spaces before and after the text.

    let expense = { date, amount, category, description: descriptionValue };

    // Get saved expenses or empty array
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Add new expense to array
    expenses.push(expense);

    // Save back to localStorage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Add row to table immediately
    addExpenseRow(expense);

    // Optionally, clear inputs for better UX
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-category").selectedIndex = 0;
    document.getElementById("description").value = "";
});

function addExpenseRow(exp) {
    tbody.innerHTML += `
    <tr>
        <td>${exp.date}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.category}</td>
        <td>${exp.description}</td>
    </tr>`;
}

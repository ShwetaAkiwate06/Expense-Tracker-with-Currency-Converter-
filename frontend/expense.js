// expense.js
apiFetch("/api/expenses");
apiFetch("/api/expenses");

// 🔐 Auth Guard
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// Helper: authenticated fetch
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  return res.json();
}

const form = document.getElementById("expense-form");
const tbody = document.getElementById("tbody");

// 📥 Load expenses on page load
document.addEventListener("DOMContentLoaded", loadExpenses);

async function loadExpenses() {
  try {
    const expenses = await apiFetch("/api/expenses");
    tbody.innerHTML = "";

    expenses.forEach(exp => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(exp.date).toLocaleDateString()}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.category}</td>
        <td>${exp.description || "--"}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load expenses:", err);
    alert("Could not fetch expenses");
  }
}

// ➕ Add new expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!amount || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  try {
    await apiFetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify({
        amount,
        category,
        description
      })
    });

    form.reset();
    loadExpenses(); // 🔄 refresh list

  } catch (err) {
    console.error("Failed to add expense:", err);
    alert("Failed to add expense");
  }
});

// 🔐 Auth Guard
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 📊 SUMMARY
    const summary = await apiFetch("/api/expenses/summary");

    document.querySelector(".total-amount").textContent =
      `₹${summary.totalExpense}`;
    document.querySelector(".monthly-expense").textContent =
      `₹${summary.monthlyExpense}`;
    document.querySelector(".budget-amount").textContent =
      `₹${summary.budget}`;

    // 🥧 CATEGORY CHART
    const categories = await apiFetch("/api/expenses/categories");
    renderCategoryChart(categories);

    // 📅 DEFAULT MONTH + YEAR
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    document.getElementById("monthSelect").value = currentMonth;
    document.getElementById("yearSelect").value = currentYear;

    // 📈 DAILY CHART (default load)
    loadDailyChart(currentMonth, currentYear);

  } catch (err) {
    console.error("Dashboard error:", err);
  }
});

// 📈 DAILY LINE CHART
function renderDailyChart(data) {
  const labels = data.map(d => `Day ${d._id}`);
  const values = data.map(d => d.total);

  const ctx = document.getElementById("monthlyChart");

  if (window.dailyChart) {
    window.dailyChart.destroy();
  }

  window.dailyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Daily Expenses",
        data: values,
        borderWidth: 2,
        fill: false
      }]
    }
  });
}

// 🔄 LOAD DAILY DATA BY MONTH + YEAR
async function loadDailyChart(month, year) {
  const data = await apiFetch(
    `/api/expenses/daily?month=${month}&year=${year}`
  );
  renderDailyChart(data);
}

// 📅 MONTH CHANGE
document.getElementById("monthSelect").addEventListener("change", () => {
  loadDailyChart(
    document.getElementById("monthSelect").value,
    document.getElementById("yearSelect").value
  );
});

// 📅 YEAR CHANGE
document.getElementById("yearSelect").addEventListener("change", () => {
  loadDailyChart(
    document.getElementById("monthSelect").value,
    document.getElementById("yearSelect").value
  );
});

// 🥧 CATEGORY PIE CHART
function renderCategoryChart(data) {
  const labels = data.map(d => d.category);
  const values = data.map(d => d.total);

  const ctx = document.getElementById("category-chart");

  if (window.categoryChart) {
    window.categoryChart.destroy();
  }

  window.categoryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values
      }]
    }
  });
}

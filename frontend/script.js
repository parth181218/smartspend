const apiURL = "http://13.219.79.177:3001/api/expenses"; // replace with your EC2 IP

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const summary = document.getElementById("summary");
const expenseList = document.getElementById("expenseList");

let expenses = [];

function getCategoryIcon(category) {
  switch (category) {
    case "Food": return "🍔";
    case "Travel": return "✈️";
    case "Bills": return "🧾";
    case "Shopping": return "🛍️";
    default: return "📦";
  }
}

function fetchExpenses() {
  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      expenses = data;
      renderExpenses();
      updateSummary();
    });
}

function addExpense() {
  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value || "Other";
  const date = dateInput.value || new Date().toISOString().split("T")[0];

  if (!title || isNaN(amount)) return alert("Please fill out both title and amount.");

  const newExpense = { title, amount, category, date };

  fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newExpense)
  })
    .then(res => res.json())
    .then(() => {
      titleInput.value = "";
      amountInput.value = "";
      categoryInput.value = "";
      dateInput.value = "";
      fetchExpenses();
    });
}

function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  summary.textContent = `Total Spent: $${total.toFixed(2)}`;
}

function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach(exp => {
    const card = document.createElement("div");
    card.className = "expense-card";

    const info = document.createElement("div");
    info.className = "expense-info";
    info.innerHTML = `
      <span>${getCategoryIcon(exp.category)} ${exp.title}</span>
      <div class="meta">${exp.category} • ${exp.date}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "expense-actions";
    actions.innerHTML = `
      <div class="amount">$${exp.amount}</div>
      <button class="edit-btn" onclick="editExpense('${exp.id}')">✏️</button>
      <button class="delete-btn" onclick="deleteExpense('${exp.id}')">🗑️</button>
    `;

    card.appendChild(info);
    card.appendChild(actions);
    expenseList.appendChild(card);
  });
}

function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;

  titleInput.value = exp.title;
  amountInput.value = exp.amount;
  categoryInput.value = exp.category;
  dateInput.value = exp.date;

  const btn = document.querySelector("button");
  btn.textContent = "Update Expense";
  btn.onclick = () => {
    const updated = {
      title: titleInput.value.trim(),
      amount: parseFloat(amountInput.value),
      category: categoryInput.value || "Other",
      date: dateInput.value
    };

    fetch(`${apiURL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).then(() => {
      btn.textContent = "Add Expense";
      btn.onclick = addExpense;
      titleInput.value = "";
      amountInput.value = "";
      categoryInput.value = "";
      dateInput.value = "";
      fetchExpenses();
    });
  };
}

function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;
  fetch(`${apiURL}/${id}`, { method: "DELETE" })
    .then(() => fetchExpenses());
}

fetchExpenses();

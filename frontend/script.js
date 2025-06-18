const API_URL = "http://13.219.79.177:3001/api/expenses"; // Replace with your EC2 IP

let editingId = null;

async function fetchExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const list = document.getElementById("expenseList");
  const summary = document.getElementById("summary");
  list.innerHTML = "";

  let total = 0;

  data.forEach(exp => {
    total += exp.amount;
    const div = document.createElement("div");
    div.className = "expense";
    div.innerHTML = `
      <span>${exp.title}</span>
      <span>
        $${exp.amount.toFixed(2)}
        <button class="edit-btn" onclick="startEdit('${exp.id}', '${exp.title}', ${exp.amount})">✏️</button>
      </span>
    `;
    list.appendChild(div);
  });

  summary.innerText = `🧾 Total Entries: ${data.length} | 💰 Total Spent: $${total.toFixed(2)}`;
}

function startEdit(id, title, amount) {
  document.getElementById("title").value = title;
  document.getElementById("amount").value = amount;
  document.querySelector("button").innerText = "Update Expense";
  editingId = id;
}

async function addExpense() {
  const title = document.getElementById("title").value.trim();
  const amount = parseFloat(document.getElementById("amount").value.trim());

  if (!title || isNaN(amount)) {
    alert("Please enter both a title and a valid amount.");
    return;
  }

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount })
    });
    editingId = null;
    document.querySelector("button").innerText = "Add Expense";
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount })
    });
  }

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";

  fetchExpenses();
}

window.onload = fetchExpenses;

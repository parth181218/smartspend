document.getElementById("expenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = parseFloat(document.getElementById("amount").value);

  const res = await fetch("http://localhost:3001/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, amount }),
  });

  const newExpense = await res.json();
  addToList(newExpense);
});

function addToList(expense) {
  const li = document.createElement("li");
  li.textContent = `${expense.title}: $${expense.amount}`;
  document.getElementById("expenseList").appendChild(li);
}

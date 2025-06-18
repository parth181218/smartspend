const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let expenses = [];

app.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

app.post("/api/expenses", (req, res) => {
  const { title, amount } = req.body;
  const newExpense = { id: Date.now(), title, amount };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Add this PUT route to update an expense
app.put("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { title, amount } = req.body;

  const index = expenses.findIndex(exp => exp.id === id);
  if (index !== -1) {
    expenses[index] = { id, title, amount };
    res.json(expenses[index]);
  } else {
    res.status(404).json({ message: "Expense not found" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));

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

app.listen(3001, () => console.log("Server running on port 3001"));

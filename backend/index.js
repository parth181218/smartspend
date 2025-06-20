const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-west-2" }); // change if needed
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "SmartSpendExpenses";

const app = express();
app.use(cors());
app.use(express.json());

// GET all expenses
app.get("/api/expenses", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamo.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error("DynamoDB scan error:", err);
    res.status(500).json({ error: "Could not fetch expenses" });
  }
});

// POST a new expense
app.post("/api/expenses", async (req, res) => {
  const { title, amount, category, date } = req.body;
  const expense = {
    id: uuidv4(),
    title,
    amount,
    category,
    date,
  };

  const params = {
    TableName: TABLE_NAME,
    Item: expense,
  };

  try {
    await dynamo.put(params).promise();
    res.status(201).json(expense);
  } catch (err) {
    console.error("DynamoDB put error:", err);
    res.status(500).json({ error: "Could not save expense" });
  }
});

// PUT update an expense
app.put("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "set title = :t, amount = :a, category = :c, date = :d",
    ExpressionAttributeValues: {
      ":t": title,
      ":a": amount,
      ":c": category,
      ":d": date,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamo.update(params).promise();
    res.json({ message: "Expense updated" });
  } catch (err) {
    console.error("DynamoDB update error:", err);
    res.status(500).json({ error: "Could not update expense" });
  }
});

// DELETE an expense
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamo.delete(params).promise();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("DynamoDB delete error:", err);
    res.status(500).json({ error: "Could not delete expense" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));

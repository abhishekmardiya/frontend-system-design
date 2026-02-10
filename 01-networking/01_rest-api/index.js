import bodyParser from "body-parser";
import express from "express";
import { todos } from "./data.js";

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get("/todos", (req, res) => {
	res.status(200).json({
		message: "todo fetched successfully",
		todos: todos,
	});
});

app.post("/todos", (req, res) => {
	const newTodo = req.body;
	todos.push(newTodo);

	res.status(201).json({
		message: "new todo added successfully",
		todos: todos,
	});
});

app.put("/todos/:id", (req, res) => {
	const { id } = req.params;
	const newTodo = req.body;

	const todoIndex = todos?.findIndex((todo) => todo?.id === id);

	if (todoIndex !== -1) {
		todos[todoIndex] = {
			id,
			...newTodo,
		};

		res.json({
			message: "todo updated successfully",
			todos: todos,
		});
	} else {
		res.status(400).json({
			message: "todo id not exists",
			todos: todos,
		});
	}
});

app.delete("/todos/:id", (req, res) => {
	const { id } = req.params;
	const newTodo = req.body;

	const todoIndex = todos?.findIndex((todo) => todo?.id === id);

	if (todoIndex !== -1) {
		todos.splice(todoIndex, 1);
	}

	res.json({
		message: "todo deleted successfully",
		todos: todos,
	});
});

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});

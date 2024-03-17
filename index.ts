// const express = require("express");
import express, { Express, Request, Response } from "express";

// const dotenv = require("dotenv");
// dotenv.config();
import dotenv from "dotenv";
dotenv.config();

// const database = require("./config/database");
// database.connect();
import { connect as connectDatabase } from "./config/database";
connectDatabase();

// const Task = require("./models/task.model");
import Task from "./models/task.model";

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false
  });

  res.json(tasks);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
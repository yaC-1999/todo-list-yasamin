import mongoose from "mongoose";
import { v4 } from "uuid";

const Task =
  mongoose.models.Task ||
  mongoose.model(
    "Task",
    new mongoose.Schema({
      task: { type: String, required: true },
      completed: { type: Boolean, default: false },
    })
  );

export default Task;

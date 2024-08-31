import Task from "../../../models/Task";
import dbConnect from "../../../utils/dbConnect";

export default async (req, res) => {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const newTask = await new Task(req.body).save();
      res.status(200).json({ data: newTask, message: "Task Added" });
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  }

  if (method === "GET") {
    try {
      const tasks = await Task.find();
      res.status(200).json({ data: tasks });
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  }
};

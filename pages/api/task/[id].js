import Task from "../../../models/Task";
import dbConnect from "../../../utils/dbConnect";

export default async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  if (method === "PUT") {
    try {
      const result = await Task.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json({ data: result, message: "Task Edited" });
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  }

  if (method === "DELETE") {
    try {
      await Task.findByIdAndDelete(id);
      res.status(200).json({ message: "Task Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  }
};

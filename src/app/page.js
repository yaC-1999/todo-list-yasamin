"use client";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function todolist() {
  const [tasks, setTasks] = useState([]);
  const [openDialogNewTask, setOpenDialogNewTask] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [task, setTask] = useState({ task: "" });
  const [selectedTask, setSelectedTask] = useState({});
  const [openAlert, setOpenAlert] = useState({ show: false, message: "" });

  const url = "http://localhost:3000/api/task";
  useEffect(() => {
    getTask();
    const alertTime = setTimeout(() => {
      setOpenAlert({ show: false, message: "" });
    }, 3000);
    return () => {
      clearTimeout(alertTime);
    };
  }, [task]);

  const getTask = () => {
    axios.get(url).then((res) => {
      console.log(res.data.data);
      setTasks(res.data.data);
    });
  };

  const handleClickOpenDialog = (mode, item) => {
    setSelectedTask(item);
    setDialogMode(mode);
    setOpenDialogNewTask(true);
  };

  const handleCloseDialogNewTask = () => {
    setOpenDialogNewTask(false);
    setSelectedTask({});
    setTask({ task: "" });
  };

  const handleChangeCheckBox = async (item) => {
    const { data } = await axios.put(url + "/" + item._id, {
      completed: !item.completed,
    });
    getTask();
  };

  const handleChangeTask = (e) => {
    setTask(
      e.target.value === ""
        ? { task: "" }
        : (prev) => ({ ...prev, task: e.target.value })
    );
  };

  const handleClickSaveButton = async () => {
    if (dialogMode === "new") {
      const { data } = await axios.post(url, task);
      // setTasks((prev) => [...prev, data.data]);
      getTask();
      console.log("added");
      setOpenAlert({ show: true, message: task.task + " Added!" });
    }
    if (dialogMode === "edit") {
      const { data } = await axios.put(url + "/" + selectedTask._id, task);
      getTask();
      setOpenAlert({ show: true, message: task.task + " Edited!" });
    }
    if (dialogMode === "delete") {
      console.log(selectedTask);
      const { data } = await axios.delete(url + "/" + selectedTask._id);
      console.log((prev) => prev.filter((t) => t._id !== selectedTask._id));
      console.log("deleted");
      setOpenAlert({ show: true, message: selectedTask.task + " Deleted!" });
      getTask();
    }
    handleCloseDialogNewTask();
    setTask({ task: "" });
    setSelectedTask({});
  };

  return (
    <div className="flex flex-col ">
      <h1 className="text-4xl text-center font-semibold text-blue-600 py-5">
        To Do List
      </h1>
      <div className="w-6/12 m-auto">
        <div className="grid gap-2">
          <button
            className="text-center border w-full p-2 border-gray-300 text-gray-400 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => handleClickOpenDialog("new")}
          >
            <AddIcon />
          </button>
          <Collapse in={openAlert.show}>
            <Alert
              variant="filled"
              severity="success"
              className="fixed bottom-5	right-5"
            >
              {openAlert.message}
            </Alert>
          </Collapse>

          <Dialog
            open={openDialogNewTask}
            onClose={handleCloseDialogNewTask}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              className={
                (dialogMode === "delete" ? "text-red-600 " : "") + "text-center"
              }
            >
              {dialogMode === "new" ? (
                "Add New Task"
              ) : dialogMode === "edit" ? (
                "Edit " + selectedTask.task
              ) : (
                <WarningIcon color="error" fontSize="large" />
              )}
            </DialogTitle>
            <DialogContent>
              {dialogMode === "delete" ? (
                <h1 className="flex items-center gap-1">
                  Are you sure delete{" "}
                  <span className="font-semibold">{selectedTask.task}</span>?
                </h1>
              ) : (
                <div className="my-2">
                  <TextField
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    onChange={handleChangeTask}
                    defaultValue={selectedTask?.task}
                  />
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={handleCloseDialogNewTask}
                color={dialogMode === "delete" ? "error" : "primary"}
              >
                Cancle
              </Button>
              <Button
                onClick={handleClickSaveButton}
                autoFocus
                variant="contained"
                color={dialogMode === "delete" ? "error" : "primary"}
                disabled={
                  dialogMode === "delete"
                    ? false
                    : selectedTask?.task
                    ? selectedTask.task === task.task || task.task === ""
                    : task.task === ""
                }
              >
                {dialogMode === "delete" ? "Delete" : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
          <div className="grid gap-1">
            {tasks.length === 0 ? (
              <div className=" justify-between border w-full p-2 border-gray-300 items-center bg-gray-50 text-center text-gray-500 ">
                No Item
              </div>
            ) : (
              tasks.map((item) => {
                return (
                  <div
                    key={item.id}
                    className=" flex justify-between border w-full p-1 border-gray-300 items-center "
                  >
                    <div className="flex gap-2 items-center ">
                      <Checkbox
                        //   color="success"
                        fontSize="small"
                        checked={item.completed}
                        onChange={() => handleChangeCheckBox(item)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <h1
                        className={
                          item.completed ? " opacity-70 line-through " : ""
                        }
                      >
                        {item.task}
                      </h1>
                    </div>
                    {/* <div className="text-xs text-gray-500">2024/05/12</div> */}
                    <div className="gap-3 flex text-gray-400 p-1">
                      <button
                        className="hover:text-blue-600"
                        onClick={() => handleClickOpenDialog("edit", item)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="hover:text-blue-600"
                        onClick={() => handleClickOpenDialog("delete", item)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

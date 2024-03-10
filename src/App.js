import React, { useState } from "react";
import "./App.css";

const EditTaskSection = ({ task, statuses, onClose, onSave, onDelete }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <span
            className="close"
            onClick={onClose}
            style={{ color: "red", cursor: "pointer", fontSize: "30px" }}
          >
            &times;
          </span>
          <h2>Edit Task</h2>
          <div className="wwe">
            <div className="title">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                style={{ width: "calc(100% - 150px)", marginLeft: "10px" }}
              />
            </div>
            <div className="desc">
              <label>Description:</label>
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                style={{ width: "calc(100% - 150px)", marginRight: "10px" }}
              ></textarea>
            </div>
            <div className="stat">
              <label>Status:</label>
              <select
                name="status"
                value={editedTask.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => onSave(editedTask)} id="savechange">
              Save Changes
            </button>
            <button
              onClick={handleDelete}
              style={{ marginLeft: "10px" }}
              id="deletecard"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Card 1", status: "Not Started", description: "" },
    { id: 2, title: "Card 2", status: "Not Started", description: "" },
    { id: 3, title: "Card 3", status: "Not Started", description: "" },
    { id: 4, title: "Card 4", status: "In Progress", description: "" },
    { id: 5, title: "Card 5", status: "Not Started", description: "" },
    { id: 6, title: "Card 6", status: "Completed", description: "" },
  ]);

  const [newTaskTitles, setNewTaskTitles] = useState({
    "Not Started": "",
    "In Progress": "",
    Completed: "",
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditSection, setShowEditSection] = useState(false);

  const statuses = ["Not Started", "In Progress", "Completed"];

  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id === parseInt(taskId));

    if (task) {
      task.status = status;
      setTasks([...tasks]);
    }
  };

  const handleAddTask = (status) => {
    const newTaskTitle = newTaskTitles[status];
    if (newTaskTitle.trim()) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        status: status,
        description: "",
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitles({ ...newTaskTitles, [status]: "" });
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditSection(true);
  };

  const handleCloseEditSection = () => {
    setShowEditSection(false);
  };

  const handleSaveChanges = (editedTask) => {
    setTasks(
      tasks.map((task) => (task.id === editedTask.id ? editedTask : task))
    );
    setShowEditSection(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const countTasks = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  return (
    <div className="app">
      <h1>Task Management</h1>
      <div className="container">
        {statuses.map((status) => (
          <div key={status} className="status">
            <h3
              style={{
                backgroundColor:
                  status === "Not Started"
                    ? "lightpink"
                    : status === "In Progress"
                    ? "lightyellow"
                    : status === "Completed"
                    ? "lightgreen"
                    : "",
              }}
            >
              {status} ({countTasks(status)})
            </h3>
            <div
              className="tasks"
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, status)}
            >
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="task"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => handleEditTask(task)}
                  >
                    {task.title}
                  </div>
                ))}
            </div>
            <div className="new-task">
              <input
                type="text"
                placeholder="Add a new task"
                value={newTaskTitles[status]}
                onChange={(e) =>
                  setNewTaskTitles({
                    ...newTaskTitles,
                    [status]: e.target.value,
                  })
                }
                style={{ width: "calc(100% - 60px)", marginRight: "10px" }}
              />
              <button onClick={() => handleAddTask(status)}>Add</button>
            </div>
          </div>
        ))}
      </div>
      {showEditSection && (
        <EditTaskSection
          task={selectedTask}
          statuses={statuses}
          onClose={handleCloseEditSection}
          onSave={handleSaveChanges}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default App;

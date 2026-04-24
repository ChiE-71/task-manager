import { useState, useEffect } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTask, setNewTask] = useState("");

  const token = localStorage.getItem("token");

  async function toggleCompleted(task) {
    let updatedValue = !task.completed;

    try {
      const response = await axios.patch(
        `/api/tasks/${task.id}`,
        { completed: updatedValue },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, completed: updatedValue } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data || error.message,
      );
    }
  }

  function openConfirm(task) {
    setTaskToDelete(task);
    setShowConfirm(true);
  }

  function closeConfirm() {
    setShowConfirm(false);
    setTaskToDelete(null);
  }

  async function confirmDelete() {
    if (!taskToDelete) return;
    await deleteTask(taskToDelete.id);
    closeConfirm();
  }

  async function createTask() {
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(
        "/api/tasks/",
        { description: newTask },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201) {
        setTasks((prev) => [response.data, ...prev]);
        setNewTask("");
      }
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response?.data || error.message,
      );
    }
  }

  useEffect(() => {
    axios
      .get("/api/tasks/", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [token]);

  useEffect(() => {
  function handleKeyDown(e) {
    if (!showConfirm) return;

    if (e.key === "Escape") {
      closeConfirm();
    }

    if (e.key === "Enter") {
      if (taskToDelete) {
        deleteTask(taskToDelete.id);
        closeConfirm();
      }
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [showConfirm, taskToDelete]);

  return (
    <div className="flex flex-col gap-2 mx-12 pb-16">
      {tasks.map((task) => {
        return (
          <div
            key={task.id}
            className={
              "flex items-center border-2 border-font rounded-xl p-2 py-4 bg-background mb-2"
            }
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
              className="mx-5 w-6 h-6 shrink-0 appearance-none border-2 border-font rounded-sm cursor-pointer
                         checked:bg-primary checked:border-primary"
            />
            <p
              className={`flex-1 ${
                task.completed ? "line-through text-gray-500" : "text-font"
              }`}
            >
              {task.description}
            </p>
            <button
              onClick={() => openConfirm(task)}
              onMouseDown={(e) => e.preventDefault()}
              className="mx-3 w-8 h-8 flex items-center justify-center rounded-full border hover:bg-hover transition"
              aria-label="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        );
      })}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-background rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Task?</h2>
            <p className="text-sm text-font mb-6">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 rounded-md border border-gray-300 text-font hover:bg-hover"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-font hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full px-12 pb-4">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-12 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 right-1/4 w-36 h-36 bg-white/5 rounded-full blur-2xl"></div>

          <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/10 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60"></div>
        </div>

        <div className="relative flex items-center border border-white/10 rounded-xl p-3 bg-background/60 backdrop-blur-md">
          <input
            type="text"
            placeholder="Write a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createTask();
            }}
            className="flex-1 bg-transparent outline-none text-font"
          />
          <button
            onClick={createTask}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover transition"
            aria-label="Add task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tasks;

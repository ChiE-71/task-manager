import { useState, useEffect } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {
    axios
      .get("/api/tasks/", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
    
  }, [token]);

  return (
    <div className="flex flex-col gap-2 mx-12">
      {tasks.map((task) => {
        return (
          <div
            key={task.id}
            className={`flex items-center border-2 border-font rounded-xl p-2 ${
              task.completed ? "bg-gray-100" : "bg-background"
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
              className="mx-5 w-6 h-6 flex-shrink-0 appearance-none border-2 border-font rounded-sm cursor-pointer
                         checked:bg-primary checked:border-primary"
            />
            <p
              className={`flex-1 ${
                task.completed ? "line-through text-gray-500" : "text-font"
              }`}
            >
              {task.task}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Tasks;

"use client";

import { Trash, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [updatedText, setUpdatedText] = useState("");
  const [newTask, setNewTask] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [task, setTask] = useState<Task[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.from("task").insert(newTask).single();
    if (error) {
      console.log(error.message);
      return;
    }
    setNewTask({ title: "", description: "" });
    fetchTask(); // Refresh list
  };

  const fetchTask = async () => {
    const { error, data } = await supabase
      .from("task")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.log(error.message);
      return;
    }
    setTask(data ?? []);
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("task").delete().eq("id", id);
    if (error) {
      console.log(error.message);
      return;
    }
    fetchTask(); // Refresh list
  };

  const updateTask = async () => {
    if (!editingTask) return;
    const { error } = await supabase
      .from("task")
      .update({ description: updatedText })
      .eq("id", editingTask.id);
    if (error) {
      console.log(error.message);
      return;
    }
    setEditingTask(null);
    setUpdatedText("");
    fetchTask(); // Refresh list
  };

  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <div className="bg-[#212121] text-white min-h-screen max-sm:p-5 w-full">
      <section className="flex justify-center items-center flex-col h-[100vh] gap-5">
        <h1 className="text-3xl">Task Manager</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border-white border p-2 text-white w-[600px] max-w-2xl max-sm:w-auto bg-transparent"
              placeholder="Enter your task"
              required
            />
            <input
              type="text"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="border-white border p-2 text-white w-[600px] max-w-2xl max-sm:w-auto bg-transparent"
              placeholder="Enter your description"
              required
            />
            <button className="px-4 py-3 rounded-2xl cursor-pointer text-black bg-white hover:bg-gray-200 transition">
              Add
            </button>
          </div>
        </form>

        {task.length > 0 && (
          <div className="w-full overflow-x-auto max-w-6xl max-sm:px-4 max-h-[230px] overflow-y-auto">
            <table className="min-w-[700px] w-full text-left border-collapse text-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Tools</th>
                </tr>
              </thead>
              <tbody>
                {task.map((task) => (
                  <tr key={task.id}>
                    <td className="border px-4 py-2">{task.id}</td>
                    <td className="border px-4 py-2">
                      {new Date(task.created_at).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{task.title}</td>
                    <td className="border px-4 py-2">{task.description}</td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => deleteTask(task.id)}
                          title="Delete"
                          className="cursor-pointer hover:text-red-500 transition"
                        >
                          <Trash size={19} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setUpdatedText(task.description);
                          }}
                          title="Edit"
                          className="cursor-pointer hover:text-yellow-400 transition"
                        >
                          <Pencil size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Edit Modal */}
            {editingTask && (
              <div className="fixed inset-0 flex justify-center items-center backdrop-blur-lg bg-black bg-opacity-50 z-50 max-sm:p-4">
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
                  <h2 className="text-lg font-bold mb-4">
                    Update Task: {editingTask.title}
                  </h2>
                  <textarea
                    className="w-full h-40 p-4 rounded-md bg-gray-800 text-white resize-none outline-none"
                    value={updatedText}
                    onChange={(e) => setUpdatedText(e.target.value)}
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setEditingTask(null)}
                      className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateTask}
                      className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    if (!title || !description) return;
    await axios.post('http://localhost:3000/tasks', { title, description });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const updateTask = async () => {
    if (!title || !description || !editingTask) return;
    await axios.put(`http://localhost:3000/tasks/${editingTask.id}`, { title, description });
    setTitle('');
    setDescription('');
    setEditingTask(null);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div>
        <input className="border p-2 m-2" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 m-2" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" onClick={editingTask ? updateTask : createTask}>
          {editingTask ? 'Update' : 'Create'} Task
        </button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="p-2 border-b flex justify-between">
            <span>{task.title}: {task.description}</span>
            <div>
              <button className="bg-yellow-500 text-white p-1 mx-1" onClick={() => { setTitle(task.title); setDescription(task.description); setEditingTask(task); }}>Edit</button>
              <button className="bg-red-500 text-white p-1" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;

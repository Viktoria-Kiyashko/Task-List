import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:3001/tasks');
    setTasks(response.data);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      const response = await axios.post('http://localhost:3001/tasks', {
        title: newTask
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
    }
  };

  
const toggleTask = async (id) => {
  try {
    const task = tasks.find(t => t.id === id);
    const response = await axios.patch(`http://localhost:3001/tasks/${id}`, {
      completed: !task.completed
    });
    
    setTasks(tasks.map(t => 
      t.id === id ? response.data : t
    ));
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
  }
};


const deleteTask = async (id) => {
  await axios.delete(`http://localhost:3001/tasks/${id}`);
  setTasks(tasks.filter(task => task.id !== id));
};

  return (
    <div className="app-container">
      <h1 className="app-title">Список задач</h1>
      <div className="task-form">
        <input
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Введите новую задачу"
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="add-button" onClick={addTask}>
          Добавить
        </button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="task-checkbox"
            />
            <span className="task-text">{task.title}</span>
            <button 
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'tasks.json');


function initTasksFile() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '[]'); 
  }
}

// Прописано для загрузки
function loadTasks() {
  try {
    initTasksFile();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Ошибка загрузки задач:', err);
    return [];
  }
}

// Для сохранения
function saveTasks(tasks) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Ошибка сохранения задач:', err);
  }
}

let tasks = loadTasks();

// Маршруты
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = {
    id: Math.floor(Math.random() * 10000), //id: Date.now() - можно было бы использовать для генерации Id, но тогда они получались бы очень длинными.Данный метод позволяет создавать уникальный id размером до 4 чисел
    title: req.body.title,
    completed: false // новая задача при появлении активна,т.е, по умолчанию не выполнена
  };
  tasks.push(newTask);
  saveTasks(tasks); // для сохранения изменений
  res.status(201).json(newTask);
});

// сохраняет изменённый статут
app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body 
    };
    saveTasks(tasks); 
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Задача не найдена' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks); 
  res.status(204).send();
});

app.listen(3001, () => {
  console.log('Сервер запущен на http://localhost:3001');
  console.log('Данные сохраняются в:', DB_FILE);
});
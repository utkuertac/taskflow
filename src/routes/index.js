const express = require('express');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');

const router = express.Router();

// API'nin ayakta olduğunu kontrol etmek için
router.get('/', (req, res) => {
  res.json({
    name: 'Taskflow API',
    version: '1.0.0',
    endpoints: ['/api/tasks', '/api/users', '/api/projects'],
  });
});

router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

module.exports = router;

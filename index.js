const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Felipe", "email": "felipe.ds@outlook.com" }

let requests = 0;
const projects = [];

function countRequests(req, res, next) {
    requests++;

    console.log(`Número de requisições: ${requests}`);

    return next();
}

server.use(countRequests);

function validateProject(req, res, next) {
    const { id, title } = req.body;
    const { id: idParam } = req.params;

    if (!id && !idParam) return res.status(400).json({ error: 'Id is required' });
    if (!title) return res.status(400).json({ error: 'Title is required' });

    return next();
}

function checkProjectInArray(req, res, next) {
    const { id } = req.params;

    const project = projects.find(item => item.id == id);

    if (!project)
        return res.status(400).json({ error: 'Project does not exists' });

    return next();
}


server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.get('/projects/:id', checkProjectInArray, (req, res) => {
    const { id } = req.params;
    const project = projects.find(item => item.id == id);

    return res.json(project);
});

server.post('/projects', validateProject, (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

server.put('/projects/:id', validateProject, checkProjectInArray, (req, res) => {

    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(item => item.id == id);

    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
    const { id } = req.params;

    const index = projects.find(item => item.id == id);

    projects.slice(index, 1);

    return res.send();
});

server.post('/projects/:id/tasks', validateProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(item => item.id == id);

    project.tasks.push(title);

    return res.json(project);
});


server.listen(3000);

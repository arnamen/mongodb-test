const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/tasks', (req, res) => {

    const task = new Task({
        userName: 'testname',
        description: 'some task dunno',
    });
    task.save()
    .then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    });

});

app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id)
    .then((result) => {
        if(!result) return res.status(404).send();
        console.log('here');
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).send();
    });
});

app.get('/tasks', (req, res) => {
    Task.find({completed: false})
    .then((result) => {
        if(!result) return res.status(404).send();
        res.send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

app.listen(port, () => console.log('server is up on port ' + port));
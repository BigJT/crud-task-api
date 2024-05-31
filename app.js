const express = require('express');
const app = express();

const mongoose = require('./database/mongoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');


/*
CORS - Cross Origin Request Security
Backend - http://localhost:3000
Frontend - http://localhost:4200
*/
// could have installed 3rd party library and done app.use(cors())
// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});

// Example of middleware ( whenever we say app.use )
app.use(express.json());  // or use 3rd party parser like body-parser

// create api endpoints to intercept requests from browser
// endpoints are the routes that the browser will hit
// Routes
/*
TaskList - Create, Read, Update, ReadTaskByListId, ReadAllTaskList
Task - Create, Read, Update, ReadTaskById, ReadAllTask
*/
// Routes or All endpoints for TaskList model
// Get all TaskLists
//http://localhost:3000/taskLists => [ {TaskList}, {TaskList} ]
// https://www.restapitutorial.com/lessons/httpmethods.html

app.get('/tasklists', (req, res) => {
	TaskList.find({})
		.then((lists) => {
			res.status(200).send(lists);
		})
		.catch((error) => {console.log(error)});
});

// endpoint to get one tasklist by tasklistid : http://127.0.0.1:3000/tasklists/66589343a0aed73ad17e89aa
app.get('/tasklists/:taskListId', (req, res) => {
	let tasklistid = req.params.taskListId;
	TaskList.find({ '_id': tasklistid })
		.then((taskList) => {
			res.status(200).send(taskList);
		})
		.catch((error) => {console.log(error)});
});

// Route or endpoint for creating TaskList
app.post('/tasklists', (req, res) => {
	//console.log("hello i am inside post method");
	console.log(req.body);

	let taskListObj = { 'title': req.body.title };
	TaskList(taskListObj).save()
		.then((taskList) => {
			res.status(201).send(taskList);
		})
		.catch((error) => {
			console.log(error);
			res.status(500);
		});
});

// PUT is full update of object
app.put('/tasklists/:tasklistId', (req, res) => {
	TaskList.findOneAndUpdate({ '_id': req.params.tasklistId}, { $set: req.body })
		.then((taskList) =>{
			res.status(200).send(taskList);
		})
		.catch((error) => {console.log(error)});
});

// PATCH is partial  update of one filed ofobject
app.patch('/tasklists/:tasklistId', (req, res) => {
	TaskList.findOneAndUpdate({ '_id': req.params.tasklistId}, { $set: req.body })
		.then((taskList) => {
			res.status(200).send(taskList);
		})
		.catch((error) => {console.log(error)});
});

// DELETE a tasklisty by id
app.delete('/tasklists/:tasklistId', (req, res) => {
	TaskList.findByIdAndDelete(req.params.tasklistId)
		.then((taskList) =>{
			res.status(201).send(taskList);
		})
		.catch((error) => {console.log(error)});
});

/* CRUD operation for Task, a task should always belong to a tasklist */
// Get all tasks for 1 TaskList , http://localhost:3000/tasklists/:tasklistId/tasks
app.get('/tasklists/:tasklistId/tasks', (req, res) => {
	Task.find({ _taskListId: req.params.tasklistId })
		.then((tasks) => {
			res.status(200).send(tasks);
		})
		.catch((error) => {console.log(error)});
});

// Create a task inside a particular tasklist
app.post('/tasklists/:tasklistId/tasks', (req, res) => {
	console.log(req.body);

	let taskObj = { 'title': req.body.title, '_taskListId': req.params.tasklistId};
	Task(taskObj).save()
		.then((task) => {
			res.status(201).send(task);
		})
		.catch((error) => {
			console.log(error);
			res.status(500);
		});
});

// Get 1 task inside 1 TaskList
// http://localhost:3000/tasklists/:tasklistId/tasks/:taskId

app.get('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
	Task.findOne({ _taskListId: req.params.tasklistId, '_id': req.params.taskId })
		.then((task) => {
			res.status(200).send(task);
		})
		.catch((error) => {console.log(error)});
});

// Update 1 task belonging to 1 TaskList
app.patch('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
	Task.findOneAndUpdate({ _taskListId: req.params.tasklistId, '_id': req.params.taskId }, { $set: req.body })
		.then((task) => {
			res.status(200).send(task);
		})
		.catch((error) => {console.log(error)});
});

// Delete 1 task belonging to 1 TaskList
app.delete('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
	Task.findOneAndDelete({ _taskListId: req.params.tasklistId, '_id': req.params.taskId })
		.then((task) => {
			res.status(200).send(task);
		})
		.catch((error) => {console.log(error)});
});

app.listen(3000, () => {
	console.log('server is running on port 3000');
});


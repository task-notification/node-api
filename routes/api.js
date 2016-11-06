var express = require('express');
var router = express.Router();

// load model
var Task = require('../models/task');
var User = require('../models/user');

// middleware to use for all requests
router.use(function(req, res, next) {
    // TODO: check user auth ?
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

/* GET home page. */
router.get('/', function (req, res) {
    res.json({message: 'welcome to our api'});
});


/**
 * USER
 *************************************************************************************************/
router.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

/**
 * TASKS
 *************************************************************************************************/
router.route('/tasks')
    // create a task (accessed from POST)
    .post(function(req, res){
        var task = new Task();                      // create a new instance of Task model
        task.description = req.body.description;    // set description from the request

        // save task and check for error
        task.save(function(err){
            if(err)
            {
                res.send(err);
            }
            res.json({ message: 'Task created!'});
        });
    })

    .get(function(req, res){
        Task.find(function (err, tasks) {
            if(err)
            {
                res.send(err);
            }
            res.json(tasks);
        });
    });

// routes ending with /tasks/:taskId
router.route('/tasks/:taskId')
    // get task by ID
    .get(function(req, res){
        Task.findById(req.params.taskId, function(err, task){
            if(err)
                res.send(err);
            res.json(task);
        });
    })
    // update task by ID
    .put(function(req, res){
        Task.findById(req.params.taskId, function (err, task) {
            if(err)
                res.send(err);

            // update task info
            task.description = req.body.description;

            // save task
            task.save(function (err) {
                if(err)
                    res.send(err);

                res.json({ message: 'Task updated!'});
            });
        });
    })
    // delete task by ID
    .delete(function (req, res) {
        Task.remove({
            _id: req.params.taskId
        }, function (err, task) {
            if(err)
                res.send(err);

            res.json({ message: 'Task successfully deleted!'});
        });
        
    });

module.exports = router;

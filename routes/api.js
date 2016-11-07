var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/database'); // get db config file

// load model
var Task = require('../models/task');
var User = require('../models/user');

// middleware to use for all requests
router.use(function(req, res, next) {
    // TODO: logging
    console.log('Something is happening.');
    next(); // go to the next routes and don't stop here
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

// route to authenticate a user (POST /api/authenticate)
router.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

/**
 * SECURITY: middleware to protect API
 *************************************************************************************************/
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || getToken(req.headers);

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                User.findOne({
                    name: decoded.name
                }, function(err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    } else {
        // if there is no token return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

/**
 * TASKS
 *************************************************************************************************/
router.route('/tasks')
    // create a task (accessed from POST /api/tasks)
    .post(function(req, res){
        var task = new Task();                      // create a new instance of Task model
        var user = req.user;                        // get user from request

        task.description = req.body.description;    // set description from the request
        task.user = user._id;

        // save task and check for error
        task.save(function(err){
            if(err)
            {
                res.send(err);
            }
            res.json({ message: 'Task created!'});
        });
    })

    // get all tasks (accessed from GET /api/tasks)
    .get(function(req, res){
        var user = req.user;                  // get user from request
        Task.find({ user: user._id }, function (err, tasks) {
            if(err)
            {
                res.send(err);
            }
            res.json(tasks);
        });
    });

// routes ending with /tasks/:taskId
router.route('/tasks/:taskId')
    // get task by ID (accessed from GET /api/tasks/:taskId)
    .get(function(req, res){
        Task.findById(req.params.taskId, function(err, task){
            if(err)
                res.send(err);
            res.json(task);
        });
    })
    // update task by ID (accessed from PUT /api/tasks/:taskId)
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
    // delete task by ID (accessed from DELETE /api/tasks/:taskId)
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

/**
 * PUSH-API routing file
 *
 */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/database'); // get db config file

var constants = require('../constants/constants.json');
var registerFunction = require('../functions/register');
var devicesFunction = require('../functions/devices');
var deleteFunction = require('../functions/delete');
var sendFunction = require('../functions/send-message');

var payloads = {};

// middleware to use for all requests
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // go to the next routes and don't stop here
});

// load model
var User = require('../models/user');


router.post('/send',function(req,res){
    var message = req.body.message;
    var registrationId = req.body.registrationId;

    var content = {
        title: req.body.title,
        body: req.body.body,
        icon: req.body.icon,
        type: req.body.type
    };

    payloads[registrationId] = content;
    console.log("registrationId:", registrationId);
    sendFunction.sendMessage(message, registrationId, function(result){
        res.json(result);
    });
});

router.get("/getPayload/:registrationId", function(req, res){
    var registrationId = req.params.registrationId;
    res.json(payloads[registrationId]);
});


/**
 * SECURITY: middleware to protect API
 *************************************************************************************************/
getToken = function (headers) {
    if (headers && headers.authorization) {
        return headers.authorization;
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
    console.log(req.headers);
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
                    username: decoded.username
                }, function(err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, message: 'Authentication failed. User not found.'});
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
 * DEVICES
 */
// TODO: wenn devideId vorhanden --> überschreibe registrationId
router.post('/devices', function (req, res) {

    var deviceName = req.body.deviceName;
    var deviceId = req.body.deviceId;
    var registrationId = req.body.registrationId;
    var endpoint = req.body.endpoint;

    if (typeof deviceName == 'undefined' || typeof deviceId == 'undefined' || typeof registrationId == 'undefined' || typeof endpoint == 'undefined') {

        console.log(constants.error.msg_invalid_param.message);
        res.json(constants.error.msg_invalid_param);

    } else if (!deviceName.trim() || !deviceId.trim() || !registrationId.trim() || !endpoint.trim()) {

        console.log(constants.error.msg_empty_param.message);
        res.json(constants.error.msg_empty_param);

    } else {

        registerFunction.register(deviceName, deviceId, registrationId, endpoint, req.user, function (result) {
            res.json(result);
            if (result.result != 'error') {
                console.log("New device added");
            }
        });
    }
});

router.get('/devices',function(req,res) {
    devicesFunction.listDevices(function(result) {
        res.json(result);
    });
});

router.delete('/devices/:device',function(req,res) {
    var registrationId = req.params.device;
    deleteFunction.removeDevice(registrationId,function(result) {
        res.json(result);
    });
});

module.exports = router;

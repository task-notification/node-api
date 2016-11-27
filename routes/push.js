/**
 * send-push routing file
 *
 * @author Michael Müller <development@reu-network.de>
 */

var express = require('express');
var router = express.Router();

var constants = require('../constants/constants.json');
var registerFunction = require('../functions/register');
var devicesFunction = require('../functions/devices');
var deleteFunction = require('../functions/delete');
var sendFunction = require('../functions/send-message');

// load model
var Device = require('../models/device');
var User = require('../models/user');

router.post('/devices', function (req, res) {

    var deviceName = req.body.deviceName;
    var deviceId = req.body.deviceId;
    var registrationId = req.body.registrationId;

    if (typeof deviceName == 'undefined' || typeof deviceId == 'undefined' || typeof registrationId == 'undefined') {

        console.log(constants.error.msg_invalid_param.message);

        res.json(constants.error.msg_invalid_param);

    } else if (!deviceName.trim() || !deviceId.trim() || !registrationId.trim()) {

        console.log(constants.error.msg_empty_param.message);

        res.json(constants.error.msg_empty_param);

    } else {

        registerFunction.register(deviceName, deviceId, registrationId, function (result) {

            res.json(result);

            if (result.result != 'error') {

                io.emit('update', {message: 'New Device Added', update: true});

            }
        });
    }
});
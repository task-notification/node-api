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

// middleware to use for all requests
router.use(function(req, res, next) {
    // TODO: logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // go to the next routes and don't stop here
});

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

                console.log("New device added");
                // io.emit('update', {message: 'New Device Added', update: true});

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

router.post('/send',function(req,res){

    var message = req.body.message;
    var registrationId = req.body.registrationId;

    sendFunction.sendMessage(message,registrationId,function(result){

        res.json(result);
    });
});


module.exports = router;

/**
 * send-message functions
 *
 * used to send message to GCM server which further delivers the message to the device.
 * (using node-gcm module)
 *
 */

var gcm = require('node-gcm');
var constants = require('../constants/constants.json');
var deviceFunctions = require('../functions/devices');
// load model
var User = require('../models/user');


exports.sendMessage = function (message, registrationId, callback)
{
    var message = new gcm.Message();

    message.collapseKey = 'demo';
    message.delayWhileIdle = true;
    message.timeToLive = 3;

    var regTokens = [registrationId];
    var sender = new gcm.Sender(constants.gcm_api_key);

    sender.send(message, {registrationTokens: regTokens}, function (err, response) {

        if (err)
        {
            console.error(err);
            callback(constants.error.msg_send_failure);
        }
        else
        {
            console.log(response);
            callback(constants.success.msg_send_success);
        }
    });
}

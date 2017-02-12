/**
 * send-message functions
 *
 * used to send message to GCM server which further delivers the message to the device.
 * (using node-gcm module)
 *
 * @author Michael Müller <development@reu-network.de>
 */

var gcm = require('node-gcm');
var constants = require('../constants/constants.json');

exports.sendMessage = function (message, registrationId, callback) {

    var message = new gcm.Message();
    // ({
    //     data: {
    //         message: message
    //     },
    //     notification: {
    //         title: "Hello, World",
    //         icon: "ic_launcher",
    //         body: "This is a notification that will be displayed if your app is in the background."
    //     }
    // });
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
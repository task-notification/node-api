/**
 * devices functions
 *
 * function to remove a registered device
 *
 * @author Michael Müller <development@reu-network.de>
 */

var device = require('../models/device');

exports.listDevices = function (callback) {
    device.find({}, function (err, devices) {
        if (!err)
            callback(devices);
    });
}


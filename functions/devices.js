/**
 * devices functions
 *
 * function to remove a registered device
 *
 */

var device = require('../models/device');

exports.listDevices = function (callback) {
    device.find({}, function (err, devices) {
        if (!err)
            callback(devices);
    });
}

exports.listDevicesByUser = function (user, callback){
	device.find({user:user}, function (err, devices) {
		if (!err)
			callback(devices);
	});
}

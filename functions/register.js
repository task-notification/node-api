/**
 * register functions
 *
 * function to add device to MongoDB
 *
 * @author Michael Müller <development@reu-network.de>
 */

var device = require('../models/device');
var constants = require('../constants/constants.json');

exports.register = function (deviceName, deviceId, registrationId, user, callback) {

    var newDevice = new device({
        deviceName: deviceName,
        deviceId: deviceId,
        registrationId: registrationId,
        user: user
    });

    device.find({registrationId: registrationId, user: user}, function (err, devices) {
        var totalDevices = devices.length;
        if (totalDevices == 0)
        {
            newDevice.save(function (err) {
                if (!err)
                {
                    callback(constants.success.msg_reg_success);
                }
                else
                {
                    callback(constants.error.msg_reg_failure);
                }
            });
        }
        else
        {
            callback(constants.error.msg_reg_exists);
        }
    });
}
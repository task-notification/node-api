/**
 * devices functions
 *
 * function to remove a registered device
 *
 * @author Michael Müller <development@reu-network.de>
 */

var mongoose = require('mongoose');
var request = require('request');
var device = require('../models/device');
var constants = require('../constants/constants.json');

exports.listDevices = function (callback) {
    device.findAll(function (err, devices) {
        if (!err)
            callback(devices);
    });
}


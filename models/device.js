/**
 * DEVICE Entity
 *
 * @author Michael Müller <development@reu-network.de>
 */

// load ORM
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create task schema
var deviceSchema = new Schema({
    deviceName         : String,
    deviceId        : String,
    registrationId    : String
});

module.exports = mongoose.model('Device', deviceSchema);

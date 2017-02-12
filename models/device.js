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
    deviceName : String,
    deviceId : String,
    registrationId : String,
    user:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Device', deviceSchema);

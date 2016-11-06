/**
 * TASK Entity
 *
 * @author Michael Müller <development@reu-network.de>
 */

// load ORM
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create task schema
var TaskSchema = new Schema({
    description: String
});

module.exports = mongoose.model('Task', TaskSchema);
/**
 * TASK Entity
 *
 */

// load ORM
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create task schema
var TaskSchema = new Schema({
    description: String,
    user: { type: ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Task', TaskSchema);

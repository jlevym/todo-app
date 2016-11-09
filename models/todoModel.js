var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({// create a new Schema
    username        : 'String',
    todo            : 'String',
    isDone          : Boolean,
    hasAttachment   : Boolean
});

var Todas = mongoose.model('Todas', todoSchema); // create a new model

module.exports = Todas; // export the model
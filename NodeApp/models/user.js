var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    fullname: {type: String, required: true},
    age: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    // uuid: {type: Schema.Types.ObjectId, ref: 'uuid' ,required: false, unique: true},
    // time: {type: Date, required: false, unique: true},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);
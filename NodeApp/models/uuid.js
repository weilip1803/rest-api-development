var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    uuid: {type: String, required: true},
    time: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});


schema.post('remove', function (uuid) {
    User.findById(uuid.user, function (err, user) {
        user.uuid = undefined;
        user.save();
    });
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('uuid', schema);
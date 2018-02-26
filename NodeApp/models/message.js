var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    publish_date: {type: String, required: true},
    isPublic: {type: Boolean, required: true},
    text: {type: String, required: true},
    idCounter : {type: Number, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required:true}

});

schema.post('remove', function (message) {
    User.findById(message.user, function (err, user) {
        user.messages.pull(message._id);
        user.save();
    });
});

module.exports = mongoose.model('Message', schema);
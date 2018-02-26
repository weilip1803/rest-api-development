var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Message = require('../models/message');
var userRoute = require('./user');
var IdCounter = require('../models/counter');


router.get('/', function (req, res, next) {
    Message.find({isPublic: true})
        .populate('user', 'fullname')
        .exec(function (err, messages) {
            if (err) {
                console.log("Should not be Error");

            }
            // console.log(messages);
            var result = []
            for (var i = 0; i < messages.length; i++) {
                console.log(messages[i]);
                result[i] = {};
                result[i]["id"] = messages[i].idCounter;
                result[i]["title"] = messages[i].title;
                result[i]["author"] = messages[i].author;
                result[i]["publish_date"] = messages[i].publish_date;
                result[i]["public"] = true;
                result[i]["text"] = messages[i].text;
            }
            // console.log(result);
            res.status(200).json({
                "status": true,
                "result": result
            });
        });
});

router.use('/', function (req, res, next) {
    // console.log("HERE:" + userRoute);
    console.log(userRoute.uuidMap[req.body.token]);
    jwt.verify(userRoute.uuidMap[req.body.token], 'secret', function (err, decoded) {
        if (err) {
            console.log("why here 123")
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        console.log("CORRECT");
        next();
    });
});
router.post('/', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    Message.find({user: decoded.user._id})
        .populate('user', 'fullname')
        .exec(function (err, messages) {
            if (err) {
                console.log("Should not be Error");

            }
            // console.log(messages);
            var result = []
            for (var i = 0; i < messages.length; i++) {
                result[i] = {};
                result[i]["id"] = messages[i].idCounter;
                result[i]["title"] = messages[i].title;
                result[i]["author"] = messages[i].author;
                result[i]["publish_date"] = messages[i].publish_date;
                result[i]["public"] = messages[i].isPublic;
                result[i]["text"] = messages[i].text;
            }
            res.status(200).json({
                "status": true,
                "result": result
            });
        });
});

router.post('/create', function (req, res, next) {
    console.log("POSTING");
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    IdCounter.find({type: "message"}, function (err, resultArray) {
        if (err) throw err;
        console.log(resultArray);
        var counterResult = resultArray[0];
        counterResult.counter = counterResult.counter + 1;
        var newCounter = new IdCounter(counterResult);
        console.log(counterResult.counter + "wtf");
        User.findById(decoded.user._id, function (err, user) {
            if (err) {
                console.log("ADD ERROR" + err);
                return res.status(200).json({
                    "status": false,
                    "error": "Invalid authentication token."
                });
            }
            var message = new Message({
                title: req.body.title,
                author: user.fullname,
                publish_date: new Date().toISOString(),
                isPublic: req.body.public,
                text: req.body.text,
                idCounter: counterResult.counter,
                user: user
            });
            user.messages.push(message);
            user.save();
            message.save(function (err, result) {
                if (err) {
                    console.log("No error should be here");
                    return res.status(200).json({
                        "status": false,
                        "error": "Invalid authentication token."
                    });
                }
                // user.messages.push(result);
                // user.save();
                newCounter.save();
                res.status(201).json({
                    "status": true,
                    "result": counterResult.counter
                });
            });
        });
    });

});
router.post('/permission', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    console.log(req.body);
    Message.find({idCounter: req.body.id}, function (err, messageArr) {
        if(!messageArr){
            //This should not happen
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        message = messageArr[0];
        if (err) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        if (!message) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        console.log(req.body.private + "\n\n\n CONFUSED");
        message.isPublic = !req.body.private;
        console.log(message.isPublic + "\n\n\n CONFUSED");
        message.save(function (err, result) {
            if (err) {
                return res.status(200).json({
                    "status": false,
                    "error": "Invalid authentication token."
                });
            }
            res.status(200).json({
                "status": true,
            });
        });
    });
});

router.post('/delete', function (req, res, next) {
    var decoded = jwt.decode(userRoute.uuidMap[req.body.token]);
    // console.log(req.query.token + "   : lol");
    console.log(req.body.id + "      ID");
    Message.find({idCounter: req.body.id}, function (err, messageArr) {
        if(!messageArr){
            //This should not happen
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        message = messageArr[0];
        console.log("should only find 1" + messageArr.length);

        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        if (message.user != decoded.user._id) {
            console.log("a" + message.user + "\nb" + decoded.user._id);
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        var removeMsg = new Message(message);
        console.log("removing");
        removeMsg.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;
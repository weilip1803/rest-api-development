var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

var User = require('../models/user');
var uuidMap = {};
router.post('/', function (req, res, next) {
    res.contentType("application/json");
    console.log(uuidMap[req.body]);
    var decoded = jwt.decode(uuidMap[req.body.token]);
    console.log("here");
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(200).json({
                "status": false,
                "error": "Invalid authentication token."
            });
        }
        res.status(200).json({
            "status": true,
            "username": user.username,
            "fullname": user.fullname,
            "age": user.age
        });
    });
});
router.post('/register', function (req, res, next) {
    console.log("Registering");
    res.contentType("application/json");

    var user = new User({
        fullname: req.body.fullname,
        age: req.body.age,
        password: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username,
        messages: []
    });
    //For bcrypt.hashSync 10 is the salt
    user.save(function(err, result) {
        if (err) {
            console.log(err);
            return res.status(200).json({
                "status": false,
                "error": "User already exists!"
            });
        }
        res.status(201).json({
            "status": true
        });
    });
});

router.post('/authenticate', function(req, res, next) {
    console.log("wtf");
    res.contentType("application/json");
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            console.log("1");
            return res.status(200).json({
                "status": false
            });
        }
        if (!user) {
            console.log("2");
            return res.status(200).json({
                "status": false
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log("3");
            return res.status(200).json({
                "status": false
            });
        };
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        var generatedUUID = uuidv4();

        console.log("1/Token:" + token  + "\nUUID:" + generatedUUID);
        uuidMap[generatedUUID] = token;

        console.log(uuidMap);

        res.status(200).json({
            status: true,
            token: generatedUUID
        });
    });
});

router.post('/expire', function (req, res, next) {
    res.contentType("application/json");
    if(uuidMap[req.body.token]){
        delete uuidMap[req.body.token];
        res.status(200).json({
            status: true
        });
    }else{
        res.status(200).json({
            status: false
        });
    }
});


exports.uuidMap = uuidMap;
module.exports = {router:router, uuidMap:uuidMap};

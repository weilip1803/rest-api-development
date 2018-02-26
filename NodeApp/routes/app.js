var express = require('express');
var router = express.Router();
var parseUrl = require('parseurl');


router.get('/', function (req, res, next) {
    console.log("Sigh");
    res.contentType("application/json");
    res.status(201).json({

        "status": true,
        "result": [
            "/",
            "/meta/heartbeat",
            "/meta/team"
        ]

    });
});


module.exports = router;

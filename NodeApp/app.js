var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var messageRoutes = require('./routes/messages');
var userRoutes = require('./routes/user');
var app = express();
// var IdCounter = require('./models/counter');
var dbhost = process.env.DBHOST || 'localhost:27017';
console.log ("STARTING HERE TEST DB HOST:  " + dbhost);
mongoose.connect( dbhost + '/node-angular');


// IdCounter.find({type: "message"}, function (err, resultArray) {
//     if (err) throw err;
//     console.log(resultArray);
//     if(resultArray.length ==0) {
//         var a = new IdCounter({counter: 0, type: "message"});
//         a.save();
//     }
// });
//Change this to the script later

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    // res.status(200);
    next();
});


app.get('/meta/heartbeat', function (req, res) {
    res.contentType("application/json");
    res.status(200).json({
        "status": true
    });
});

app.get('/meta/members', function (req, res) {
    res.contentType("application/json");
    res.status(200).json({
        "status": true,
        "result": [
            "Wei Lip",
            "James",
            "Ben",
            "Shirlene"
        ]
    });
});

app.use('/diary', messageRoutes);
app.use('/users', userRoutes.router);

// app.use('', appRoutes);
app.get('/', function (req, res, next) {
    res.contentType("application/json");
    res.status(200).json({
        "status": true,
        "result": [
            "/",
            "/meta/heartbeat",
            "/meta/members"
        ]
    });
    // return res.render('index');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index');
});




module.exports = app;

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config');
var setupController = require('./controllers/setupController');
var apiController   = require('./controllers/apiController');




var port = process.env.PORT|| 3000;

app.set('view engine', 'ejs');
//app.use('/assets', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index');
});
// connect to mongodb using mongoose

mongoose.connect(config.getDbConnectionString());
setupController(app); // the function to generate seed data if app/setupTodos
apiController(app);   // the function containing the api endpoints for add, delete, get

app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

app.listen(port);
console.log('listening on port: ' + port);
// this module will house all the api endpoints
var Todos = require('../models/todoModel');
var User   = require('../models/user'); // get our mongoose model
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');


module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(morgan('dev'));

    var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
    //var config = require('./config'); // get our config file

    // get all the todos of a specific user
    app.get('/api/todos', function(req, res) {
    // app.get('/api/todos/:uname', function(req, res) {        

        //Todos.find({ username: req.params.uname }, function(err, todos) {
        Todos.find({}, function(err, todos) {
            if (err) throw err;

            res.send(todos);
        });

     });   

    // get specific todo by id
    app.get('/api/todo/:id', function(req, res) {
       
       Todos.findById({ _id: req.params.id }, function(err, todo) {
           if (err) throw err;
           
           res.send(todo);
       });
        
    });
    
  /*  app.post('/api/todo', function(req, res) {
        if (req.body.id) {
            Todos.findByIdAndUpdate(req.body.id, { todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function(err, todo) {
                if (err) throw err;
                
                res.send('Success -the todo was updated');
            });
        }
        
       else {
           console.log(req);
           var newTodo = Todos({
              username: 'jeffrey',
               todo: req.body.todo,
             isDone: req.body.isDone,
              hasAttachment: req.body.hasAttachment
           });
           newTodo.save(function(err) {
               if (err) throw err;
               res.send('Successfully saved newTodo');
           });
            
        }
        
    });*/

// create todo and send back all todos after creation
    app.post('/api/todo', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todos.create({
            todo : req.body.todo,
            isDone : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todos.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

  app.delete('/api/todos/:todo_id', function(req, res) {
        Todos.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todos.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });


    // create a sample user
    app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    name: 'Nick Cerminara', 
    password: 'password',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});


    // delete a todo
    /*app.delete('/api/todo', function(req, res) {
        Todos.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('the todo was removed');
        })
    });*/
    




// route to authenticate a user (POST http://localhost:8080/api/authenticate)
app.post('/api/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.'});
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 1440 // expires in 24 hours 
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});



// route middleware to verify a token
app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// route to show a random message (GET http://localhost:8080/api/)
app.get('/api', function(req, res) {
 res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
app.get('/api/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   


}

  
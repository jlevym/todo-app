// this module will house all the api endpoints
var Todos = require('../models/todoModel');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');


module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(morgan('dev'));

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


    // delete a todo
    /*app.delete('/api/todo', function(req, res) {
        Todos.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('the todo was removed');
        })
    });*/    
}

  
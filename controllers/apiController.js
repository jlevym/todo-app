// this module will house all the api endpoints
var Todos = require('../models/todoModel');
var bodyParser = require('body-parser');

module.exports = function(app) {

  app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // get all the todos of a specific user
    app.get('/api/todos/:uname', function(req, res) {

        Todos.find({ username: req.params.uname }, function(err, todos) {
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
    
    app.post('/api/todo', function(req, res) {
        if (req.body.id) {
            Todos.findByIdAndUpdate(req.body.id, { todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function(err, todo) {
                if (err) throw err;
                
                res.send('Success -the todo was updated');
            });
        }
        
       else {
           
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
        
    });

    // delete a todo
    app.delete('/api/todo', function(req, res) {
        Todos.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('the todo was removed');
        })
    });    
}

  
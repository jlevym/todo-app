//make a node module that responds to the url /api/setupTodos
// creating 3 documents

var Todos = require('../models/todoModel');

module.exports = function(app) {
    app.get('/api/setupTodos', function(req, res) {

        // seed data
        var starterTodos = [
            {
                username        : 'jeffrey',
                todo            : 'finish this tutorial',
                isDone          : false,
                hasAttachment   : false
            },

            {
                username        : 'jeffrey',
                todo            : 'do the scotch tutorial',
                isDone          : false,
                hasAttachment   : false
            },

            {
                username        : 'jeffrey',
                todo            : 'complete the code for this',
                isDone          : false,
                hasAttachment   : false
            }
        ];

        // save the data and if succesful, send the mongodb db to page
        Todos.create(starterTodos, function(err, results){
            res.send(results);
        });

    });
}
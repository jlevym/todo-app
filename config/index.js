// set up the configuration string
//mongodb://<dbuser>:<dbpassword>@ds139937.mlab.com:39937/todoapp

var configValue = require('./config');

module.exports = {
    
    getDbConnectionString: function() {
        return 'mongodb://' + configValue.uname + ':' + configValue.pwd + '@ds139937.mlab.com:39937/todoapp';
    }
}
var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/spiced-final-project';

module.exports = {
    update: function() {
        MongoClient.connect(dbUrl, function(err, db){
            console.log("connected to DB");
            db.close();
        });
    }         
};

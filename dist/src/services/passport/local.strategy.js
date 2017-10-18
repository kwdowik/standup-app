'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;

module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password'
    }, function (username, password, done) {
        var url = 'mongodb://localhost/standupdb';

        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');
            collection.findOne({ username: username }, function (err, results) {
                if (results != null && results.password === password) {
                    var user = results;
                    done(null, user);
                } else {
                    done(null, false, { message: 'Wrong password' });
                    console.log('wrong password');
                }
            });
        });
    }));
};
//# sourceMappingURL=local.strategy.js.map
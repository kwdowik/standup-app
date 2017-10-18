var mongodb = require('mongodb').MongoClient;

var authController = function (nav) {

    var getLoginPage = function (req, res) {
        res.render('login', {
            title: 'Login Page',
            nav: nav,
            message: req.query.error ? 'Invalid username or password.' : undefined,
            userName: req.user === undefined ? undefined : req.user.username
        });
    };

    var tryToSignIn = function (req, res) {
        res.redirect('/auth/profile');
    };

    var checkAuthentication = function (req, res, next) {
        console.log(`check auth, user: ${req.user.username}`);
        if(!req.user) {
            res.redirect('/auth');
        }
        next();
    };
    
    var signIn = function (req, res) {
        var message = 'User successful sign in.';
        res.redirect('/?message=' + message);
    };

    var signOut = function (req, res) {
      req.logout();
      var message = 'User successful sign out.';
      res.redirect('/?message=' + message);
    };

    var getRegisterPage = function (req, res) {
        res.render('register', {
            title: 'Register Page',
            nav: nav
        });
    };

    var register = function (req, res) {
        mongodb.connect('mongodb://localhost/standupdb', function (err, db) {
            var collection = db.collection('users');
            var user = {
                username: req.body.userName,
                password: req.body.password
            };
            
            collection.insert(user, function (err, results) {
                var message = `User: ${user.username} successful registered.`;
                if(err) {
                    message = err;
                }
                res.redirect('/?message=' + message);
            });
        });
    };


    return {
        getLoginPage: getLoginPage,
        tryToSignIn: tryToSignIn,
        signIn: signIn,
        signOut: signOut,
        checkAuthentication: checkAuthentication,
        getRegisterPage: getRegisterPage,
        register: register
    };

};

module.exports = authController;
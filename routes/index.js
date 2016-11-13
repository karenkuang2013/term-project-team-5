const express = require('express'),
    router = express.Router(),
    session = require('express-session');
    router.use(session({
    secret: 'some-873-key-test',
    resave: true,
    saveUninitialized: true
}));
const path = require('path')
let username
let pgp = require('pg-promise')();
let db = pgp('postgres://postgres:QAZxsw_456@localhost:5432/rummydb')

router.use(express.static('public', {'root': './'}))

// Authentication and Authorization Middleware
const auth = function(request, response, next) {
  if (request.session && request.session.user === username && request.session.admin)
  {
    return next();
  }
  else
  {
    return  response.sendFile(path.join(__dirname,'html/index.html'));
  }
};

// Get content endpoint
router.get('/', auth, function (request, response) {
     response.sendFile(path.join(__dirname,'html/lobby.html'));
});


//login homepage
router.get('/lobby', function(request, response, next) {
	 response.sendFile(path.join(__dirname,'html/index.html'));
});

// Login request
router.post('/lobby', function (request, response) {

  if (!request.body.username || !request.body.password) {
    response.send('login failed');    
  }
  else checkPlayerExists(request, response)

});

 //register page
router.get('/register', function (request, response) {
	console.log(__dirname);
    response.sendFile(path.join(__dirname,'html/register.html'));
});

// Logout endpoint
router.get('/logout', function (request, response) {
    request.session.destroy();
     response.sendFile(path.join(__dirname,'html/index.html'));
});
 
 
 function checkPlayerExists(request, response)
 {
    db.one("select * from players where username like $1 and passwrd like $2", [request.body.username, request.body.password])
    .then(function (data) {
		username  = request.body.username;
        request.session.user = request.body.username;
        request.session.admin = true;
        response.sendFile(path.join(__dirname,'html/lobby.html'));
    })
    .catch(function (error) {
		  response.send("incorrect username/password");
    });
	
 }
 
module.exports = router;

module.exports = function(db, io) {
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

  router.use(express.static('public', {'root': './'}))
  
  const dbjs = require('./database')
  const database = new dbjs(db)

  // Authentication and Authorization Middleware
  const auth = function(request, response, next) {
    if (request.session && request.session.user === username && request.session.admin)
    {
      return next();
    }
    else
    {
      return response.render('login');
    }
  };

  // Get content endpoint
  router.get('/', function (request, response) {
    response.redirect('/login');
  });

  //login homepage
  router.get('/login', auth, function(request, response, next) {
    response.redirect('/lobby');
  });

  // Login request
  router.post('/login', function (request, response) {
    if (!request.body.username || !request.body.password) {
      if(!request.session.user === username) {
        response.send('login failed');
      }
    }
    else {
      checkPlayerExists(request, response)
    }
  });

  //register page
  router.get('/register', function (request, response) {
    response.render('registration');
  });

  //register page
  router.post('/register', function (request, response) {
    database.registerNewUser(request,response)
  });

  // Logout endpoint
  router.get('/logout', function (request, response) {
    request.session.destroy();
    response.render('login');
  });


  function checkPlayerExists(request, response)
  {
      database.checkPlayerExists(request,response)
  }

  return router;
}
  // module.exports = router

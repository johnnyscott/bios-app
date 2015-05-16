// npm shit
var express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    clientSessions = require('client-sessions'),
    users = require('./users.js'),
    biosCRUD = require('./bios-crud.js'),
    biosApp = express(),
    emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

biosApp.use(bodyParser.json()); // for parsing application/json
biosApp.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
biosApp.use(multer()); // for parsing multipart/form-data
biosApp.use(clientSessions({
  cookieName: 'biosSession', // cookie name dictates the key name added to the request object
  secret: 'lasjfwaoij322joi230094lkoij3ASDawoija32', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));
biosApp.set('view engine', 'jade');

var printSession = function (req){
  if(typeof req.biosSession === 'object'){
    return JSON.stringify(req.biosSession, null, 2);
  }
};

var dashboardOptions = {
  pages:[
    {"name": "Dashboard", "href": "/dashboard", "iconClass": "tachometer"},
    {"name": "Settings", "href": "/dashboard/settings", "iconClass": "cog"},
    {"name": "Bios", "href": "/dashboard/bios", "iconClass": "users"}
  ]
};

var publicOptions = {
  pages:[
    {"name": "Home", "href": "/"},
    {"name": "Login", "href": "/login"}
  ]
};

biosApp.get('/dashboard(/:where(settings|bios|)|)', function (req, res){
  var sesh = printSession(req),
      where = req.params.where.replace('/','');
  if(req.params.where === ""){
    where = 'dashboard';
  }
  // redirect if not logged in
  if(req.biosSession.loggedIn !== true){
      res.redirect('/login');
      return;
  }

  if(where === "bios"){
    biosCRUD.getAll(function (err, docs){
      console.log("HERE HERE HERE HERE");

      //console.log('BIOS BIOS BIOS');
      res.render('dashboard/dashboard',
        {"session": sesh,
         "navItems": dashboardOptions.pages,
         "where": where,
         "allBios": docs
      });
    });


  }else{
    res.render('dashboard/dashboard',
      {"session": sesh,
       "navItems": dashboardOptions.pages,
       "where": where
    });
  }
});



biosApp.get('/logout', function (req, res){
  req.biosSession.reset();
  res.redirect('/login');
});

biosApp.get('/:where(login|home|)', function (req, res){
  var where = req.params.where;
  if(req.params.where === ""){
    where = 'home';
  }

  // if logged in already, redirect to dashboard
  if(req.biosSession.loggedIn === true){
    res.redirect('/dashboard');
    return;
  }
  req.biosSession.lastTime = (new Date).getSeconds();

  var sesh = printSession(req);

  res.render('public/public', {"session": sesh, "navItems": publicOptions.pages, "where": where});
});


biosApp.post('/api/login', function (req, res){
  var answer = {
    "success": false,
    "redirectTo": '',
    "errors": []
  },
      foundUser;

  var addError = function(msg){
    answer.errors.push(msg);
  };

  // valid email and password?
  if(typeof req.body.email === "string" && req.body.email.length > 0){
    if(emailRegex.test(req.body.email)){
      // valid email
    }else{
      addError("Email is invalid")
    }
  }else{
    addError("Email is required");
  }

  // valid password?
  if(typeof req.body.password === "string" && req.body.password.length > 0){
    // valid password
  }else{
    addError("Password is required");
  }

  if(answer.errors.length === 0){
    foundUser = users.getUser(req.body.email, req.body.password);

    if(foundUser !== undefined){
        answer.success = true;
        answer.redirectTo = '/dashboard';
        req.biosSession.email = req.body.email;
        req.biosSession.loggedIn = true;
    }else{
      addError("No such email and password combination found");
    }
  }

  // if valid email and password find user
  res.send(JSON.stringify(answer));
});

biosApp.use('/static', express.static('./static'));

biosApp.listen(8080);


/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    redirects = require('./redirects');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Catch all for redirects
app.use(function(req, res, next) {
  console.log(req.path, redirects);
  if (! (req.path in redirects)) next();
  // console.log(redirects[req.path]);
  res.redirect(redirects[req.path]);
});

app.use(function(req, res, next) {
  console.log('404 - ' + req.path);
  res.status(404);
  res.render('error-404');
});

app.get('/', function(req, res){
  res.render('index');
});
// redirect staff, team
app.get('/about/lawrenceville-staff', function(req, res) {
  res.render('staff');
});
// redirect /about, /about-organic-salon.php
app.get('/about/organic-salon-spa', function(req, res) {
  res.render('about');
});
// redirect /services, /organic-salon-spa-services.php
app.get('/services/hair-massage-yoga', function(req, res) {
  res.render('services');
});
// /yoga-schedule
app.get('/services/yoga', function(req, res) {
  res.render('yoga');
});
// redirect /contact, /contact.php
app.get('/contact-metamorphosis', function(req, res) {
  res.render('contact');
});
app.post('/contact-metamorphosis', function(req, res) {
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'staff@spapgh.com',
          pass: 'meta 5112'
      }
  });
  var name = req.param('name'),
      email = req.param('email'),
      body =  req.param('body');

  var mail = {
      from: email,
      replyTo: email,
      to: 'mia@spapgh.com',
      subject: 'Web Contact from ' + name,
      text: body
  };

  transporter.sendMail(mail, function(error, info){
    console.log(error ? error : ('Message sent: ' + info.response));
  });

  res.render('contact', {'submitted': true});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

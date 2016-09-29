+var express = require('express');
+var path = require('path');
+var favicon = require('serve-favicon');
+var logger = require('morgan');
+var cookieParser = require('cookie-parser');
+var bodyParser = require('body-parser');
+
+var routes = require('./routes/index');
+var users = require('./routes/users');
+
+var app = express();
+// socket confing
+var server = require('http').Server(app);
+var io = require('socket.io')(server);
+server.listen(8080, "127.0.0.1");
+
+// socket connect
+io.on('connection', function (socket) {
+  console.log('socket is working...');
+
+  io.emit('this', { will: 'be received by everyone'});
+
+  socket.on('private message', function (from, msg) {
+  console.log('I received a private message by ', from, ' saying ', msg);
+  socket.emit('rec_msg','client','lo mai aa gaya');
+  });
+
+
+  //Use 
+  socket.on('join', function (data) {
+    socket.join(data.email);
+    console.log('is joing :- '+data.email);
+    io.sockets.in('abhi@gmail.com').emit('new_msg', {msg: 'hello'});
+  });
+
+
+ 
+
+
+  socket.on('disconnect', function () {
+  	console.log('socket disconnect...');
+    io.emit('user disconnected');
+  });
+});
+
+
+
+
+// view engine setup
+app.set('views', path.join(__dirname, 'views'));
+app.set('view engine', 'ejs');
+
+// uncomment after placing your favicon in /public
+//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
+app.use(logger('dev'));
+app.use(bodyParser.json());
+app.use(bodyParser.urlencoded({ extended: false }));
+app.use(cookieParser());
+app.use(express.static(path.join(__dirname, 'public')));
+
+app.use('/', routes);
+app.use('/users', users);
+
+// catch 404 and forward to error handler
+app.use(function(req, res, next) {
+  var err = new Error('Not Found');
+  err.status = 404;
+  next(err);
+});
+
+// error handlers
+
+// development error handler
+// will print stacktrace
+if (app.get('env') === 'development') {
+  app.use(function(err, req, res, next) {
+    res.status(err.status || 500);
+    res.render('error', {
+      message: err.message,
+      error: err
+    });
+  });
+}
+
+// production error handler
+// no stacktraces leaked to user
+app.use(function(err, req, res, next) {
+  res.status(err.status || 500);
+  res.render('error', {
+    message: err.message,
+    error: {}
+  });
+});
+
+
+module.exports = app;

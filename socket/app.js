var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});
var count=0;
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    count=count+1;
   console.log("Number of user connected is",count);

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
    count=count-1;
      console.log('some user are disconnected so remaining connected user is',count);
   });
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});

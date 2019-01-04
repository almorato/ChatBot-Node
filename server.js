require('dotenv').config()
const APIAI_TOKEN = 'a2a3465a4d8544eb8c066bd81bde5986';
const APIAI_SESSION_ID = 'b17793b7b4e34a5d8dba68d034c38a8d';
const apiai = require('apiai')(APIAI_TOKEN);

const express = require('express');
var path = require('path');

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const server = app.listen(4221);
const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

app.get('/', function(req, res){
      res.render("index");
})


io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});

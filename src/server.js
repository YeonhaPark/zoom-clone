import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const port = 3000;

// creating a server from express application
const server = http.createServer(app);

// create websocket server ( create both http and websocket server )
// http and websocket server share same port
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on('connection', (socket) => {
  // 브라우저별로 소켓이 생성됨
  sockets.push(socket);
  socket["nickname"] = "Anonymous"
  console.log('Connected to Client');
  socket.on('close', () => console.log('Disconnected from Client'));
  socket.on('message', (message) => {
    const { type, payload } = JSON.parse(message);

    switch (type) {
      case 'message':
       sockets.forEach(s => s.send(`${socket.nickname}: ${payload}`))
        break;
      case 'nickname':
        socket["nickname"] = payload;
        break; 
      default:
        break;
    }
  });
});
server.listen(port, () => console.log(`listening at http://localhost:${port}`));

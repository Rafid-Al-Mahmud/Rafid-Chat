const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const port = process.env.PORT || 3000;
const static = (root = "") => app.get(/./, (req, res) => res.sendFile(__dirname + root + req.url));
const inpt = '$ INPUT-> ';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/output', (req, res) => {
  res.sendFile(__dirname + '/output.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    console.log("\nOne Client: " + msg);
    process.stdout.write(inpt);
    fs.readFile("output.txt", 'utf8', (err, data) => io.emit('output_logs', data));
  });
  socket.on('chat username', username => {
    io.emit('chat username', username);
    console.log("\nOne Client: " + username);
    process.stdout.write(inpt);
    fs.readFile("output.txt", 'utf8', (err, data) => io.emit('output_logs', data));
  });
});

static();

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// fs.watch('output.txt', (eventType, filename) => {
//   if (eventType === 'change') {
//     fs.readFile("output.txt", 'utf8', (err, data) => io.emit('output_logs', data));
//   }
// });

process.stdin.setEncoding('utf8');
console.log("Send a messege from here:")
process.stdin.on('data', function (input) {
  if (input !== "") {
    io.emit('chat message', "Server: " + input);
    console.log("Server: " + input);
    process.stdout.write(inpt);
  }
});
process.stdout.write(inpt);

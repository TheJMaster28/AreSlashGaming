const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/", function (req, res) {
   res.sendFile(__dirname + "public/login.html");
});

io.on("connection", function (socket) {
   console.log(" a user has connected");
});

http.listen(3000, function () {
   console.log("listening on port 3000");
});

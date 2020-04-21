const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

app.use(express.static("public"));

app.get("/", function (req, res) {
   res.sendFile(__dirname + "public/index.html");
});

http.listen(port, function () {
   console.log(`listening on port ${port}`);
});

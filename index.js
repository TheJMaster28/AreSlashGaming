
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const googleConfig = require("./OAuth/config.js");
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var port = 3000;

var User = require("./models/user");

app.use(express.static("public"));

app.get("/", function (req, res) {
   res.sendFile(__dirname + "public/index.html");
});

http.listen(port, function () {
   console.log(`listening on port ${port}`);
});


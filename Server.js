var http = require("http");
var socketIO = require("socket.io");
var app = http
    .createServer(function () {
    console.log("start media server");
})
    .listen(8088);
var server = socketIO.listen(app);
var callerSocket = null;
var calleeSocket = null;
var rooms = new Map();
console.log("start server");
server.sockets.on("connection", function (socket) {
    socket.on("start", function (room) {
        console.log("Received request to create or join room " + room);
        var roomNum = rooms.get(room);
        if (!roomNum) {
            callerSocket = socket;
            rooms.set(room, 1);
        }
        else if (roomNum > 1) {
            socket.emit("full");
            return;
        }
        else {
            calleeSocket = socket;
            rooms.set(room, 2);
            callerSocket.on("sdp", function (sdp) {
                console.log("caller sdp");
                calleeSocket.emit("offer sdp", sdp);
            });
            calleeSocket.on("sdp", function (sdp) {
                console.log("callee sdp");
                callerSocket.emit("answer sdp", sdp);
            });
            callerSocket.on("candidate", function (info) {
                console.log("caller candidate");
                calleeSocket.emit("update candidate", info);
            });
            calleeSocket.on("candidate", function (info) {
                console.log("callee candidate");
                callerSocket.emit("update candidate", info);
            });
        }
    });
    socket.on("bye", function () {
        console.log("received bye");
    });
});

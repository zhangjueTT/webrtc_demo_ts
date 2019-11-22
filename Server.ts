const http = require("http");
const socketIO = require("socket.io");

const app = http
  .createServer(() => {
    console.log("start media server");
  })
  .listen(8088);
const server = socketIO.listen(app);

let callerSocket: any = null;
let calleeSocket: any = null;

const rooms = new Map<number, number>();

server.sockets.on("connection", (socket: any) => {
  socket.on("start", (room: number) => {
    console.log("Received request to create or join room " + room);
    const roomNum = rooms.get(room);
    if (!roomNum) {
      callerSocket = socket;
      rooms.set(room, 1);
    } else if (roomNum > 1) {
      socket.emit("full");
      return;
    } else {
      calleeSocket = socket;
      rooms.set(room, 2);
      callerSocket.on("sdp", (sdp: any) => {
        calleeSocket.emit("answer sdp", sdp);
      });
      calleeSocket.on("sdp", (sdp: any) => {
        calleeSocket.emit("offer sdp", sdp);
      });

      callerSocket.on("candidate", (info: any) => {
        calleeSocket.emit("update candidate", info);
      });
      calleeSocket.on("candidate", (info: any) => {
        calleeSocket.emit("update candidate", info);
      });
    }
  });

  socket.on("bye", () => {
    console.log("received bye");
  });
});

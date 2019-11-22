// const http = require("http");
// const socketIO = require("socket.io");

// const app = http
//   .createServer(() => {
//     console.log("start media server");
//   })
//   .listen(8088);
// const server = socketIO.listen(app);

// let callerSocket: any = null;
// let calleeSocket: any = null;

// const rooms = new Map<number, number>();

// console.log("start server");
// server.sockets.on("connection", (socket: any) => {
//   socket.on("start", (room: number) => {
//     console.log("Received request to create or join room " + room);
//     const roomNum = rooms.get(room);
//     if (!roomNum) {
//       callerSocket = socket;
//       rooms.set(room, 1);
//     } else if (roomNum > 1) {
//       socket.emit("full");
//       return;
//     } else {
//       calleeSocket = socket;
//       rooms.set(room, 2);
//       callerSocket.on("sdp", (sdp: any) => {
//         console.log("caller sdp");
//         calleeSocket.emit("offer sdp", sdp);
//       });
//       calleeSocket.on("sdp", (sdp: any) => {
//         console.log("callee sdp");
//         callerSocket.emit("answer sdp", sdp);
//       });

//       callerSocket.on("candidate", (info: any) => {
//         console.log("caller candidate");
//         calleeSocket.emit("update candidate", info);
//       });
//       calleeSocket.on("candidate", (info: any) => {
//         console.log("callee candidate");
//         callerSocket.emit("update candidate", info);
//       });
//     }
//   });

//   socket.on("bye", () => {
//     console.log("received bye");
//   });
// });

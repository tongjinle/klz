import express from "express";
import socketServer from "socket.io";
import http from "http";
import cors from "cors";
import messageHandle from "./messageHandle";
import lobby from "./lobby";
import { RoomStatus } from "./room";

let app = express();

const port = 3000;

app.use(cors());

let userIdList: string[] = [];

app.get("/info", (req, res) => {
  let info = lobby.getLobbyInfo();
  res.json({ info });
});

app.get("/userIdList", (req, res) => {
  res.json({ userIdList });
});

enum SocketType {
  connect = "connect",
  reg = "reg",
  login = "login",
  logout = "logout",
  message = "message",
  disconnect = "disconnect"
}

interface IUser {
  username: string;
  isLogin: boolean;
}

let server = http.createServer(app);

let io = socketServer(server);

io.on("connect", socket => {
  console.log("user connenct:", socket.id);
  let userId: string = socket.id;
  if (lobby.canAddUser(userId)) {
    lobby.addUser(userId);
    lobby.addSocket(socket);
  }

  socket.emit(SocketType.connect);

  socket.on("message", (type, data) => {
    console.log("message receive");
    messageHandle(socket, type, data);
  });

  socket.on("disconnect", reason => {
    let userId = socket.id;
    lobby.removeUser(userId);
    lobby.removeSocket(userId);

    console.log("disconent id:", userId);
    console.log("disconent reason:", reason);
  });
});

server.listen(port, () => {
  console.log("app launch");
});

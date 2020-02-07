import cors from "cors";
import express from "express";
import http from "http";
import socketServer from "socket.io";
import lobby from "./lobby";
import messageHandle from "./messageHandle";

console.log("messageHandle lobbyId", lobby.id);
let app = express();

const port = 3000;

console.log("in app.ts", lobby.id);

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
    console.log("add userId:", userId);
    lobby.addUser(userId);
    lobby.addSocket(socket);

    console.log(lobby.userList);
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

    console.log("****************************************");
    console.log("disconent id:", userId);
    console.log("disconent reason:", reason);
    console.log("****************************************");
  });
});

server.listen(port, () => {
  console.log("app launch");
});

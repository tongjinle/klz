import express from "express";
import socketServer from "socket.io";
import http from "http";
import cors from "cors";
import messageHandle from "./messageHandle";
import roomMgr from "./roomMgr";
import { RoomStatus } from "./room";

let app = express();

const port = 3000;

app.use(cors());

let userIdList: string[] = [];

app.get("/info", (req, res) => {
  let info = roomMgr.getLobbyInfo();
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

let userList: IUser[] = [];

let server = http.createServer(app);

let io = socketServer(server);

io.on("connect", socket => {
  console.log("user connenct:", socket.id);
  userIdList.push(socket.id);

  socket.emit(SocketType.connect);

  // // 注册
  // socket.on(SocketType.reg, () => {
  //   let username = Math.floor(Math.random() * 1e12).toString(16);
  //   userList.push({ username, isLogin: false });
  //   socket.emit(SocketType.reg, { username });
  // });

  // // 登录
  // socket.on(SocketType.login, ({ username }) => {
  //   let rst: { flag: boolean };
  //   let user = userList.find(user => user.username === username);
  //   if (user) {
  //     rst = { flag: true };
  //     socket["username"] = username;
  //     user.isLogin = true;
  //   } else {
  //     rst = { flag: false };
  //   }

  //   socket.emit(SocketType.login, rst);
  // });

  // // 登出
  // socket.on(SocketType.logout, () => {
  //   let rst: { flag: boolean };
  //   let username = socket["username"];
  //   let user: IUser;
  //   if (username) {
  //     user = userList.find(user => user.username === username);
  //   }
  //   if (username && user) {
  //     user.isLogin = false;
  //     rst = { flag: true };
  //   } else {
  //     rst = { flag: false };
  //   }
  //   socket.emit(SocketType.logout, rst);
  //   if (rst.flag) {
  //     socket.disconnect();
  //   }
  // });
  socket.on("message", (type, data) => {
    console.log("message receive");
    messageHandle(socket, type, data);
  });

  socket.on("disconnect", reason => {
    let id = socket.id;
    userIdList = userIdList.filter(userId => userId !== id);

    // roomMgr.removeId();
    let roomId = socket["roomId"];
    if (roomId) {
      let room = roomMgr.find(roomId);
      room.userIdList = room.userIdList.filter(userId => userId !== id);
      room.status = RoomStatus.notFull;
    }

    socket.leaveAll();

    console.log("disconent id:", id);
    console.log("disconent reason:", reason);
  });
});

server.listen(port, () => {
  console.log("app launch");
});

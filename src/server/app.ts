import express from "express";
import socketServer from "socket.io";
import http from "http";
import cors from "cors";
import messageHandle from "./messageHandle";

let app = express();

const port = 3000;

app.use(cors());

app.get("/test", (req, res) => {
  res.json({ game: "klz" });
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
  console.log("user connenct");
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
    console.log("disconent:", reason);
  });
});

server.listen(port, () => {
  console.log("app launch");
});

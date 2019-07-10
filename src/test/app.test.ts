import assert = require("assert");
import process, { ChildProcess } from "child_process";
import path from "path";
import SocketClient from "socket.io-client";
import MessageType from "../server/messageType";
import {
  EnterRoomNotify,
  LeaveRoomResponse,
  LeaveRoomNotify
} from "../server/protocol";

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe("app", () => {
  let worker: ChildProcess;
  let jack: SocketIOClient.Socket;
  let tom: SocketIOClient.Socket;
  let lucy: SocketIOClient.Socket;
  let roomIdList: string[];

  before(async function() {
    this.timeout(30 * 1000);
    let file = path.resolve(__dirname, "../server/app.js");
    console.log(file);
    worker = process.fork(file);
    // process.exec('node ')
    await delay(2 * 1000);

    jack = SocketClient("http://localhost:3000");
    tom = SocketClient("http://localhost:3000");
    lucy = SocketClient("http://localhost:3000");
  });

  afterEach(async function() {
    jack.removeAllListeners();
    tom.removeAllListeners();
    lucy.removeAllListeners();
  });

  after(async function() {
    jack.close();
    lucy.close();
    tom.close();
    worker.kill();
  });

  it("message-lobby", async function() {
    jack.send(MessageType.lobbyRequest);
    return new Promise(resolve => {
      jack.on("message", (type, data) => {
        if (MessageType.lobbyResponse === type) {
          assert(data.list.length > 0);
          resolve();
          // 后面要用到roomId
          roomIdList = data.list.map(n => n.id);
        }
      });
    });
  });

  it("message-enterRoom", async function() {
    jack.send(MessageType.enterRoomRequest, { roomId: roomIdList[0] });
    return new Promise(resolve => {
      jack.on("message", (type, data) => {
        if (MessageType.enterRoomResponse === type) {
          console.log(data);
          assert(data.code === 0);
          resolve();
        }
      });
    });
  });

  it("message-enterRoom-notify", async function() {
    tom.send(MessageType.enterRoomRequest, { roomId: roomIdList[0] });
    return new Promise(resolve => {
      jack.on("message", (type, data: EnterRoomNotify) => {
        if (MessageType.enterRoomNotify === type) {
          console.log(data);
          assert(data.info.userIdList.length === 2);
          resolve();
        }
      });
    });
  });

  it("message-enterRoom-response-fail", async function() {
    lucy.send(MessageType.enterRoomRequest, { roomId: roomIdList[0] });
    return new Promise(resolve => {
      lucy.on("message", (type, data) => {
        if (MessageType.enterRoomResponse === type) {
          console.log(data);
          assert(data.code !== 0);
          resolve();
        }
      });
    });
  });

  it("message-leaveRoom", async function() {
    jack.send(MessageType.leaveRoomRequest, { roomId: roomIdList[0] });
    return Promise.all([
      new Promise(resolve => {
        jack.on("message", (type, data: LeaveRoomResponse) => {
          if (MessageType.leaveRoomResponse === type) {
            console.log(data);
            assert(data.code === 0);
            resolve();
          }
        });
      }),
      new Promise(resolve => {
        tom.on("message", (type, data: LeaveRoomNotify) => {
          if (MessageType.leaveRoomNotify === type) {
            console.log(data);
            assert(data.userId === jack.id);
            resolve();
          }
        });
      })
    ]);
  });
});

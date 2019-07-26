import assert = require("assert");
import process, { ChildProcess } from "child_process";
import path from "path";
import SocketClient from "socket.io-client";
import lobby from "../server/lobby";
import MessageType from "../server/messageType";
import * as protocol from "../server/protocol";
import { UserStatus } from "../server/user";

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
    await delay(2 * 1000);
  });

  afterEach(async function() {
    jack.removeAllListeners();
    tom.removeAllListeners();
    lucy.removeAllListeners();
  });

  after(async function() {
    this.timeout(30 * 1000);
    jack.close();
    lucy.close();
    tom.close();

    await delay(5 * 1000);
    worker.kill();
  });

  it("lobby", async function() {
    console.log(lobby.userList);

    jack.send(MessageType.lobbyRequest);
    return new Promise(resolve => {
      jack.on("message", (type, data) => {
        if (MessageType.lobbyResponse === type) {
          assert(data.list.length > 0);
          // 后面要用到roomId
          roomIdList = data.list.map(n => n.id);

          resolve();
        }
      });
    });
  });

  // jack进入房间
  // 期望:jack收到res
  it("enterRoom", async function() {
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

  // tom也进入房间
  // 期望:jack收到noti
  it("enterRoom-notify", async function() {
    tom.send(MessageType.enterRoomRequest, { roomId: roomIdList[0] });
    return new Promise(resolve => {
      jack.on("message", (type, data: protocol.EnterRoomNotify) => {
        if (MessageType.enterRoomNotify === type) {
          console.log(data);
          assert(data.info.userIdList.length === 2);
          resolve();
        }
      });
    });
  });

  // lucy尝试进入房间
  // 期望:lucy收到失败的res(因为房间已经满员)
  it("enterRoom-response-fail", async function() {
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

  // jack离开房间
  // 期望:jack收到离开的res
  // 期望:tom收到jack离开的noti
  xit("leaveRoom", async function() {
    jack.send(MessageType.leaveRoomRequest, { roomId: roomIdList[0] });
    return Promise.all([
      new Promise(resolve => {
        jack.on("message", (type, data: protocol.LeaveRoomResponse) => {
          if (MessageType.leaveRoomResponse === type) {
            console.log(data);
            assert(data.code === 0);
            resolve();
          }
        });
      }),
      new Promise(resolve => {
        tom.on("message", (type, data: protocol.LeaveRoomNotify) => {
          if (MessageType.leaveRoomNotify === type) {
            console.log(data);
            assert(data.userId === jack.id);
            resolve();
          }
        });
      })
    ]);
  });

  // tom准备
  // 期望:tom收到res
  xit("ready", async function() {
    tom.send(MessageType.readyRequest);
    return new Promise(resolve => {
      tom.on("message", (type, data: protocol.ReadyResponse) => {
        if (MessageType.readyResponse === type) {
          assert(data.code === 0);
          resolve();
        }
      });
    });
  });

  // jack进入房间
  // 期望:jack在res中收到tom的准备状态
  xit("enterRoom-after others ready", async function() {
    jack.send(MessageType.enterRoomRequest, { roomId: roomIdList[0] });
    return new Promise(resolve => {
      jack.on("message", (type, data: protocol.EnterRoomResponse) => {
        if (MessageType.enterRoomResponse === type) {
          assert(data.code === 0);
          let index = data.info.userIdList.findIndex(id => id !== jack.id);
          let status = data.info.userStatusList[index];
          assert(status === UserStatus.ready);
          resolve();
        }
      });
    });
  });

  // tom反准备
  // 期望:jack收到tom反准备的noti
  xit("unready", async function() {
    tom.send(MessageType.unReadyRequest);
    return new Promise(resolve => {
      jack.on("message", (type, data: protocol.UnReadyNotify) => {
        if (MessageType.unReadyNotify === type) {
          assert(data.userId === tom.id);
          resolve();
        }
      });
    });
  });

  // tom准备
  // jack准备
  // 期望:tom收到jack准备的noti
  // 期望:因为都准备了,开启游戏,双方收到游戏开始的noti
  xit("startGame", async function() {
    this.timeout(10 * 1000);
    tom.send(MessageType.readyRequest);
    jack.send(MessageType.readyRequest);

    return Promise.all([
      new Promise(resolve => {
        tom.on("message", (type, data: protocol.ReadyNotify) => {
          if (MessageType.readyNotify === type) {
            assert(data.userId === jack.id);
            resolve();
          }
        });
      }),
      new Promise(resolve => {
        jack.on("message", (type, data: protocol.GameStartNotify) => {
          if (MessageType.gameStartNotify === type) {
            assert(data.info);
            resolve();
          }
        });
      }),
      new Promise(resolve => {
        tom.on("message", (type, data: protocol.GameStartNotify) => {
          if (MessageType.gameStartNotify === type) {
            assert(data.info);
            resolve();
          }
        });
      })
    ]);
  });
});

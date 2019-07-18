import assert = require("assert");
import process, { ChildProcess } from "child_process";
import path, { resolve } from "path";
import SocketClient from "socket.io-client";
import lobby from "../server/lobby";
import MessageType from "../server/messageType";
import * as protocol from "../server/protocol";
import { UserStatus } from "../server/user";
import { read } from "fs";
import { IChessBoardInfo } from "../logic/types";

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe("app", () => {
  let worker: ChildProcess;
  let jack: SocketIOClient.Socket;
  let tom: SocketIOClient.Socket;
  let roomIdList: string[];
  let firstRoomId: string;
  let gameInfo: IChessBoardInfo;

  beforeEach(async function() {
    this.timeout(30 * 1000);
    let file = path.resolve(__dirname, "../server/app.js");
    console.log(file);
    worker = process.fork(file);

    jack = SocketClient("http://localhost:3000");
    tom = SocketClient("http://localhost:3000");
    await delay(2 * 1000);

    // 获取第一个房间的id
    jack.send(MessageType.lobbyRequest);
    firstRoomId = await new Promise(resolve => {
      jack.on("message", (type, data: protocol.LobbyResponse) => {
        if (MessageType.lobbyResponse === type) {
          resolve(data.list[0].id);
        }
      });
    });

    console.log({ firstRoomId });

    // jack和tom加入房间,并且准备(确保串行)
    let joinRoom = (socket: SocketIOClient.Socket) => {
      return new Promise(resolve => {
        socket.send(MessageType.enterRoomRequest, { roomId: firstRoomId });
        socket.on("message", (type, data: protocol.EnterRoomResponse) => {
          console.log(type, data);
          if (MessageType.enterRoomResponse === type) {
            resolve();
          }
        });
      });
    };

    let ready = (socket: SocketIOClient.Socket) => {
      return new Promise(resolve => {
        socket.send(MessageType.readyRequest);
        socket.on("message", (type, data: protocol.ReadyResponse) => {
          if (MessageType.readyResponse === type) {
            resolve();
          }
        });
      });
    };

    let isStart = (socket: SocketIOClient.Socket) => {
      return new Promise(resolve => {
        socket.on("message", (type, data: protocol.GameStartNotify) => {
          if (MessageType.gameStartNotify === type) {
            gameInfo = data.info;
            resolve();
          }
        });
      });
    };

    await Promise.all([
      isStart(jack),
      new Promise(async resolve => {
        await joinRoom(jack);
        await ready(jack);

        await joinRoom(tom);
        await ready(tom);
        resolve();
      })
    ]);
  });

  afterEach(async function() {
    this.timeout(10 * 1000);

    jack.disconnect();
    tom.disconnect();

    await delay(2 * 1000);
    worker.kill();
  });

  it("map", async function() {
    this.timeout(10 * 1000);

    assert(gameInfo.mapName === "normal");
    assert(gameInfo.width === 8 && gameInfo.height === 8);
    assert(gameInfo.seed);
    assert(gameInfo.chessList && gameInfo.chessList.length);
  });
});

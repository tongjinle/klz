import assert = require("assert");
import process, { ChildProcess } from "child_process";
import path, { resolve } from "path";
import SocketClient from "socket.io-client";
import lobby from "../server/lobby";
import MessageType from "../server/messageType";
import * as protocol from "../server/protocol";
import { UserStatus } from "../server/user";
import { read } from "fs";
import {
  IChessBoardInfo,
  IChessInfo,
  ChessColor,
  ChessType,
  SkillType,
  ChangeType,
  HpChange
} from "../logic/types";
import Chess from "../logic/chess/chess";

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function createAssert<T>(
  socket: SocketIOClient.Socket,
  checkType: MessageType,
  check: (data: T) => void
) {
  return new Promise(resolve => {
    socket.on("message", (type: MessageType, data: T) => {
      if (checkType === type) {
        check(data);
        resolve();
      }
    });
  });
}

describe("app", () => {
  let worker: ChildProcess;
  let jack: SocketIOClient.Socket;
  let tom: SocketIOClient.Socket;
  let roomIdList: string[];
  let firstRoomId: string;
  let gameInfo: IChessBoardInfo;

  let redFootmanId: string;
  let blackMagicId: string;

  before(async function() {
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
    jack.removeAllListeners();
    tom.removeAllListeners();
  });

  after(async function() {
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

    redFootmanId = gameInfo.chessList.find(
      ch => ch.position.x === 0 && ch.position.y === 1
    ).id;

    blackMagicId = gameInfo.chessList.find(
      ch => ch.color === ChessColor.black && ch.type === ChessType.magic
    ).id;

    console.log(gameInfo.chessList);
  });

  // 请求回合
  // 请求当前玩家
  it("round", async function() {
    jack.send(MessageType.roundRequest);
    await createAssert<protocol.RoundResponse>(
      jack,
      MessageType.roundResponse,
      data => {
        assert(data.round === 1);
        assert(data.userId === jack.id);
      }
    );
  });

  it("activeChessList", async function() {
    // 请求当前可以行动的棋子
    jack.send(MessageType.activeChessListRequest);
    await createAssert<protocol.ActiveChessListResponse>(
      jack,
      MessageType.activeChessListResponse,
      data => {
        console.log(data.chessIdList);
        assert(data.chessIdList.length);
      }
    );
  });

  // 选择棋子
  // 选择(0,1)的步兵
  it("choose chess", async function() {
    let query: protocol.ChooseChessRequest = {
      position: { x: 0, y: 1 }
    };
    jack.send(MessageType.chooseChessRequest, query);
    await createAssert<protocol.ChooseChessResponse>(
      jack,
      MessageType.chooseChessResponse,
      data => {
        assert(data.code === 0);
      }
    );
  });

  // 请求当前棋子

  // 请求当前棋子可以行动的坐标
  // (0,1)的步兵的移动位置是[(0,2)]
  it("moveRange", async function() {
    jack.send(MessageType.rangeRequest);
    await createAssert<protocol.RangeResponse>(
      jack,
      MessageType.rangeResponse,
      data => {
        console.log(data);
        assert.deepEqual(data.positionList, [{ x: 0, y: 2 }]);
      }
    );
  });

  // 请求当前棋子可以使用的技能
  // footman没有可用的技能
  it("activeSkillList", async function() {
    let reqData: protocol.ActiveChessListRequest;
    let resData: protocol.ActiveChessListResponse;

    jack.send(MessageType.activeSkillListRequest, reqData);

    await createAssert<protocol.ActiveSkillListResponse>(
      jack,
      MessageType.activeSkillListResponse,
      data => {
        console.log(data);
        assert(data.code === 0 && data.skillTypeList.length === 0);
      }
    );
  });

  // 移动棋子
  // 他人监听棋子的移动
  it("move chess", async function() {
    let reqData: protocol.MoveChessRequest = { position: { x: 0, y: 2 } };
    jack.send(MessageType.moveChessRequest, reqData);
    await createAssert<protocol.MoveChessResponse>(
      jack,
      MessageType.moveChessResponse,
      data => {
        console.log(data);
        assert(data.code === 0);
      }
    );

    await createAssert<protocol.MoveChessNotify>(
      tom,
      MessageType.moveChessNotify,
      data => {
        console.log(data);
        assert.deepEqual(data, {
          userId: jack.id,
          position: { x: 0, y: 2 },
          chessId: redFootmanId
        });
        assert(data.position);
      }
    );
  });

  // 现在轮到tom的回合

  it("round-tom", async function() {
    jack.send(MessageType.roundRequest);

    await createAssert<protocol.RoundResponse>(
      jack,
      MessageType.roundResponse,
      data => {
        console.log(data);
        assert(data.userId === tom.id);
      }
    );
  });

  // tom选择magic
  it("tom选择magic", async function() {
    let reqData: protocol.ActiveChessListRequest;
    tom.send(MessageType.activeChessListRequest, reqData);
    await createAssert<protocol.ActiveChessListResponse>(
      tom,
      MessageType.activeChessListResponse,
      data => {
        data.chessIdList.find(chId => chId === blackMagicId);
      }
    );

    {
      let reqData: protocol.ChooseChessRequest = {
        position: { x: 4, y: 7 }
      };
      tom.send(MessageType.chooseChessRequest, reqData);
      await createAssert<protocol.ChooseChessResponse>(
        tom,
        MessageType.chooseChessResponse,
        data => {
          assert(data.code === 0);
        }
      );
    }
  });

  //
  it("tom把magic移动到(4,3)", async function() {
    let reqData: protocol.RangeRequest;
    tom.send(MessageType.rangeRequest, reqData);
    await createAssert<protocol.RangeResponse>(
      tom,
      MessageType.rangeResponse,
      data => {
        assert(data.positionList.find(po => po.x === 4 && po.y === 3));
      }
    );

    {
      let reqData: protocol.MoveChessRequest = { position: { x: 4, y: 3 } };
      tom.send(MessageType.moveChessRequest, reqData);
      await createAssert<protocol.MoveChessResponse>(
        tom,
        MessageType.moveChessResponse,
        data => {
          assert(data.code === 0);
        }
      );
    }
  });
  //

  //
  it("请求当前棋子可以使用的技能", async function() {
    let reqData: protocol.ActiveSkillListRequest;
    tom.send(MessageType.activeSkillListRequest, reqData);
    await createAssert<protocol.ActiveSkillListResponse>(
      tom,
      MessageType.activeSkillListResponse,
      data => {
        assert(data.skillTypeList.find(skType => skType === SkillType.fire));
      }
    );

    {
      let reqData: protocol.ChooseSkillRequest = { skillType: SkillType.fire };
      tom.send(MessageType.chooseSkillRequest, reqData);
      await createAssert<protocol.ChooseSkillResponse>(
        tom,
        MessageType.chooseSkillResponse,
        data => {
          assert(data.code === 0);
        }
      );
    }
  });

  it('tom对(4,1)的棋子使用技能"fire"', async function() {
    let reqData: protocol.CastSkillRequest = { position: { x: 4, y: 1 } };
    tom.send(MessageType.castSkillRequest, reqData);
    await createAssert<protocol.CastSkillResponse>(
      tom,
      MessageType.castSkillResponse,
      data => {
        assert(data.code === 0);
      }
    );

    await createAssert<protocol.CastSkillNotify>(
      jack,
      MessageType.castSkillNotify,
      data => {
        assert(data.change.type === ChangeType.hp);
        let change: HpChange = data.change.data as HpChange;
        assert(change.abs === 0 && change.rela === -4);
      }
    );
  });

  // 监听游戏的结束(所有人)
  // 监听投降(所有人)
});

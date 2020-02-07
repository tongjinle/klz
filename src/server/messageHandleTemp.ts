import { Socket } from "socket.io";
import lobby from "./lobby";
import MessageType from "./messageType";
import * as protocol from "./protocol";
import { lookup } from "dns";
import { ChangeType } from "../logic/types";

let genDict = (socket: Socket) => {
  let dict: { [type: string]: (data: any) => void } = {};

  // 帮助函数
  const help = {
    getUser: () => lobby.findUser(socket.id),
    getRoom: () => {
      let user = help.getUser();
      if (user) {
        return lobby.findRoom(user.roomId);
      }
    },
    getGame: () => {
      let room = help.getRoom();
      if (room) {
        return lobby.findGame(room.gameId);
      }
    },
    getChessBoard: () => {
      let game = help.getGame();
      if (game) {
        return game.chessBoard;
      }
    }
  };

  // 发送消息
  let send = (type: MessageType, data: any) => socket.send(type, data);
  // 发送通知
  let notify = (type: MessageType, data: any) =>
    socket.broadcast.send(type, data);
  // 发送在房间中的通知(本人不接受消息)
  let notifyInRoom = (roomId: string, type: MessageType, data: any) =>
    socket.to(roomId).broadcast.send(type, data);
  // 发送给房间中所有人(本人也接受到消息)
  let notifyAllInRoom = (roomId: string, type: MessageType, data: any) => {
    let room = lobby.findRoom(roomId);
    // console.log("messageHandle.notifyAllInRoom:", room.userIdList);
    room.userIdList
      .map(userId => lobby.findSocket(userId))
      .forEach(socket => {
        socket.send(type, data);
      });
  };

  // 聊天
  dict[MessageType.chatRequest] = (data: protocol.ChatRequest) => {
    let resData: protocol.ChatResponse = { code: 0 };
    send(MessageType.chatResponse, resData);

    let resNotify: protocol.ChatNotify = data;
    notify(MessageType.chatNotify, resNotify);
  };

  // 查询房间列表
  dict[MessageType.lobbyRequest] = () => {
    let data: protocol.LobbyResponse = { code: 0, list: lobby.getLobbyInfo() };
    send(MessageType.lobbyResponse, data);
  };

  // 创建房间
  //   dict[MessageType.createRoom]=({roomName:string})=>{
  //       let room :RoomDataType= {title:'',}
  //   };

  // 进入房间
  dict[MessageType.enterRoomRequest] = (data: protocol.EnterRoomRequest) => {
    let resData: protocol.EnterRoomResponse;
    let notiData: protocol.EnterRoomNotify;
    let roomId = data.roomId;
    let userId = socket.id;

    // can
    let can = lobby.canEnterRoom(userId, roomId);
    if (can.code) {
      send(MessageType.enterRoomResponse, can);
      return;
    }

    // action
    let room = lobby.findRoom(roomId);
    lobby.enterRoom(userId, roomId);

    resData = { code: 0, info: lobby.getRoomInfo(room) };
    notiData = { info: lobby.getRoomInfo(room) };

    // message
    send(MessageType.enterRoomResponse, resData);
    notifyInRoom(roomId, MessageType.enterRoomNotify, notiData);
  };

  // 离开房间
  dict[MessageType.leaveRoomRequest] = (data: protocol.LeaveRoomRequest) => {
    let resData: protocol.LeaveRoomResponse;
    let notiData: protocol.LeaveRoomNotify;
    let userId = socket.id;

    // can
    let can = lobby.canLeaveRoom(userId);
    if (can.code) {
      send(MessageType.leaveRoomResponse, can);
      return;
    }

    // action
    let user = lobby.findUser(userId);
    let roomId = user.roomId;
    lobby.leaveRoom(userId);

    resData = { code: 0 };
    notiData = { userId };

    // message
    send(MessageType.leaveRoomResponse, resData);
    notifyInRoom(roomId, MessageType.leaveRoomNotify, notiData);
  };

  // 准备
  dict[MessageType.readyRequest] = (data: protocol.ReadyRequest) => {
    let resData: protocol.ReadyResponse;
    let notiData: protocol.ReadyNotify;

    let userId = socket.id;
    // can
    let can = lobby.canUserReady(userId);
    console.log({ can });
    if (can.code) {
      send(MessageType.readyResponse, can);
      return;
    }

    //action
    lobby.userReady(userId);
    let user = lobby.findUser(userId);
    let roomId = user.roomId;

    resData = { code: 0 };
    notiData = { userId };

    // message
    send(MessageType.readyResponse, resData);
    notifyInRoom(roomId, MessageType.readyNotify, notiData);

    // 查看游戏是不是开始了
    // 尝试开启游戏
    if (lobby.canStartGame(roomId)) {
      console.log("messageHandle:游戏开始了", roomId);
      lobby.startGame(roomId);

      let room = lobby.findRoom(roomId);
      console.log(roomId, room);
      let game = lobby.findGame(room.gameId);

      // notify
      let notiDataOfStartGame: protocol.GameStartNotify;
      notiDataOfStartGame = { info: game.chessBoard.toString() };
      notifyAllInRoom(roomId, MessageType.gameStartNotify, notiDataOfStartGame);
    }
  };

  // 反准备
  dict[MessageType.unReadyRequest] = (data: protocol.UnReadyRequest) => {
    let resData: protocol.UnReadyResponse;
    let notiData: protocol.UnReadyNotify;

    let userId = socket.id;

    // can
    let can = lobby.canUserUnReady(userId);
    if (can.code) {
      send(MessageType.unReadyResponse, can);
      return;
    }

    // action
    lobby.userUnReady(userId);

    resData = { code: 0 };
    notiData = { userId };
    let user = lobby.findUser(userId);
    let room = lobby.findRoom(user.roomId);
    let roomId = room.id;

    // message
    send(MessageType.unReadyResponse, resData);
    notifyInRoom(roomId, MessageType.unReadyNotify, notiData);
  };

  // 投降

  // 查询回合
  dict[MessageType.roundRequest] = (data: protocol.RoundRequest) => {
    let resData: protocol.RoundResponse;
    let userId = socket.id;
    let game = help.getGame();
    resData = {
      code: 0,
      userId: game.chessBoard.currentPlayerName,
      round: game.chessBoard.round
    };
    send(MessageType.roundResponse, resData);
  };

  // 请求可以选择的棋子
  dict[MessageType.activeChessListRequest] = (
    data: protocol.ActiveChessListRequest
  ) => {
    let resData: protocol.ActiveChessListResponse;
    let game = help.getGame();
    let list = game.chessBoard.getActiveChessList();
    resData = { code: 0, chessIdList: list.map(ch => ch.id) };
    send(MessageType.activeChessListResponse, resData);
  };

  // 选择棋子
  dict[MessageType.chooseChessRequest] = (
    data: protocol.ChooseChessRequest
  ) => {
    let resData: protocol.ChooseChessResponse;

    let game = help.getGame();
    // can
    // todo

    // action
    let ch = game.chessBoard.getChessByPosition(data.position);
    game.chessBoard.chooseChess(ch);

    // message
    resData = { code: 0 };
    send(MessageType.chooseChessResponse, resData);
  };

  // 请求棋子可以移动的距离
  dict[MessageType.rangeRequest] = (data: protocol.MoveChessRequest) => {
    let resData: protocol.RangeResponse;
    let game = help.getGame();

    // can
    // todo

    // action
    let positionList = game.chessBoard.currentChess.getMoveRange();

    // message
    resData = { code: 0, positionList };
    send(MessageType.rangeResponse, resData);
  };

  // 反选择棋子
  // 移动棋子
  dict[MessageType.moveChessRequest] = (data: protocol.MoveChessRequest) => {
    let resData: protocol.MoveChessResponse;
    let notiData: protocol.MoveChessNotify;

    let userId = socket.id;
    let room = help.getRoom();
    let game = help.getGame();

    // can
    // todo

    // action
    let chessId = game.chessBoard.currentChess.id;
    let position = data.position;
    game.chessBoard.moveChess(data.position);
    resData = { code: 0 };
    send(MessageType.moveChessResponse, resData);

    // game.chBoard
    notiData = { userId, chessId, position };
    notifyInRoom(room.id, MessageType.moveChessNotify, notiData);
  };

  // 当前棋子可选择的技能
  dict[MessageType.activeSkillListRequest] = (
    data: protocol.ActiveChessListResponse
  ) => {
    let resData: protocol.ActiveSkillListResponse;

    let chBoard = help.getChessBoard();
    // can
    // todo

    // action
    let chess = chBoard.currentChess;
    let skillTypeList = chess.activeSkillList.map(sk => sk.type);

    // message
    resData = { code: 0, skillTypeList };
    console.log({ resData });
    send(MessageType.activeSkillListResponse, resData);
  };

  // 选择技能
  dict[MessageType.chooseSkillRequest] = (
    data: protocol.ChooseSkillRequest
  ) => {
    let resData: protocol.ChooseSkillResponse;

    // can
    // todo

    // action
    let chBoard = help.getChessBoard();
    let skillType = data.skillType;
    chBoard.chooseSkill(skillType);
    resData = { code: 0 };
    send(MessageType.chooseSkillResponse, resData);
  };

  // 反选择技能
  dict[MessageType.unChooseSkillRequest] = (
    data: protocol.UnChooseSkillRequest
  ) => {
    let resData: protocol.UnChooseSkillResponse;

    // can
    // todo

    // action
    let chBoard = help.getChessBoard();
    chBoard.unChooseSkill();

    // message
    resData = { code: 0 };
    send(MessageType.unChooseSkillResponse, resData);
  };

  // 施放技能
  dict[MessageType.castSkillRequest] = (data: protocol.CastSkillRequest) => {
    let resData: protocol.CastSkillResponse;
    let notiData: protocol.CastSkillNotify;

    let chBoard = help.getChessBoard();
    let room = help.getRoom();
    // can
    // todo

    // action
    let lastRound = chBoard.round;
    let position = data.position;
    chBoard.castSkill(position);

    // message
    resData = { code: 0 };
    send(MessageType.castSkillResponse, resData);
    // noti
    let change = chBoard.changeTable.recordList.find(
      re => re.round === lastRound && re.type === "hp"
    );
    console.log(position);
    // console.log(chBoard.changeTable.recordList);
    console.log(change);

    notiData = { code: 0, change };
    notifyAllInRoom(room.id, MessageType.castSkillNotify, notiData);
    // todo
  };

  return dict;
};

function handle(socket: Socket, type: MessageType, data: any) {
  console.log({ type, data });
  let fn = genDict(socket)[type];
  if (fn) {
    fn(data);
  } else {
    console.warn(`***********************************************************`);
    console.warn(`no such ${type} method`);
    console.warn(`***********************************************************`);
  }
}

export default handle;

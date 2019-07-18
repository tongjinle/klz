import { Socket } from "socket.io";
import lobby from "./lobby";
import MessageType from "./messageType";
import * as protocol from "./protocol";
import { lookup } from "dns";

let genDict = (socket: Socket) => {
  let dict: { [type: string]: (data: any) => void } = {};

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
      notiDataOfStartGame = { info: game.chBoard.toString() };
      notifyAllInRoom(roomId, MessageType.gameStartNotify, notiDataOfStartGame);

      console.log("messageHandle:游戏开始的信息发送了", notiDataOfStartGame);
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
  // 选择棋子
  // 反选择棋子
  // 移动棋子
  // 选择技能
  // 反选择技能
  // 施放技能

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

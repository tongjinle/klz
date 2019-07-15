import { Socket } from "socket.io";
import {
  ChatRequest,
  LobbyResponse,
  EnterRoomRequest,
  EnterRoomResponse,
  ChatResponse,
  ChatNotify,
  EnterRoomNotify,
  LeaveRoomRequest,
  LeaveRoomResponse,
  LeaveRoomNotify,
  ReadyRequest,
  ReadyResponse,
  ReadyNotify
} from "./protocol";
import MessageType from "./messageType";
import lobby from "./lobby";
import { RoomStatus } from "./room";

let genDict = (socket: Socket) => {
  let dict: { [type: string]: (data: any) => void } = {};

  // 发送消息
  let send = (type: MessageType, data: any) => socket.send(type, data);
  // 发送通知
  let notify = (type: MessageType, data: any) =>
    socket.broadcast.send(type, data);
  // 发送在房间中的通知
  let notifyInRoom = (roomId: string, type: MessageType, data: any) =>
    socket.to(roomId).broadcast.send(type, data);

  // 聊天
  dict[MessageType.chatRequest] = (data: ChatRequest) => {
    let resData: ChatResponse = { code: 0 };
    send(MessageType.chatResponse, resData);

    let resNotify: ChatNotify = data;
    notify(MessageType.chatNotify, resNotify);
  };

  // 查询房间列表
  dict[MessageType.lobbyRequest] = () => {
    let data: LobbyResponse = { code: 0, list: lobby.getLobbyInfo() };
    send(MessageType.lobbyResponse, data);
  };

  // 创建房间
  //   dict[MessageType.createRoom]=({roomName:string})=>{
  //       let room :RoomDataType= {title:'',}
  //   };

  // 进入房间
  dict[MessageType.enterRoomRequest] = (data: EnterRoomRequest) => {
    let resData: EnterRoomResponse;
    let notiData: EnterRoomNotify;
    let roomId = data.roomId;
    let userId = socket.id;

    //
    let user = lobby.findUser(userId);

    // 如果已经在房间了,就不能进入了
    if (user.roomId) {
      resData = { code: -1, message: "已经在房间了" };
      send(MessageType.enterRoomResponse, resData);
      return;
    }

    let room = lobby.findRoom(roomId);
    if (room) {
      if (room.userIdList.length === 2) {
        resData = { code: -3, message: "房间已经满员了" };
        send(MessageType.enterRoomResponse, resData);
        return;
      }

      // socket 加入房间
      lobby.joinRoom(userId, roomId);
      resData = { code: 0, info: lobby.getRoomInfo(room) };

      send(MessageType.enterRoomResponse, resData);

      // 通知
      notiData = { info: lobby.getRoomInfo(room) };
      notifyInRoom(roomId, MessageType.enterRoomNotify, notiData);
      return;
    } else {
      resData = { code: -2, message: "找不到该id的房间" };
      send(MessageType.enterRoomResponse, resData);
      return;
    }
  };

  // 离开房间
  dict[MessageType.leaveRoomRequest] = (data: LeaveRoomRequest) => {
    let resData: LeaveRoomResponse;
    let notiData: LeaveRoomNotify;
    let userId = socket.id;

    let user = lobby.findUser(userId);
    let roomId: string = user.roomId;
    // 查看现在是不是在房间中
    if (!user.roomId) {
      resData = { code: -1, message: "并未在任何房间" };
      send(MessageType.leaveRoomResponse, resData);
      return;
    }

    let room = lobby.findRoom(roomId);
    if (!room) {
      resData = { code: -2, message: "找不到该id的房间" };
      send(MessageType.leaveRoomResponse, resData);
      return;
    }

    lobby.leaveRoom(userId, roomId);

    resData = { code: 0 };
    send(MessageType.leaveRoomResponse, resData);

    // 通知
    notiData = { userId };
    notifyInRoom(roomId, MessageType.leaveRoomNotify, notiData);
  };

  // 准备
  dict[MessageType.readyRequest] = (data: ReadyRequest) => {
    let resData: ReadyResponse;
    let notiData: ReadyNotify;

    let userId = socket.id;
    lobby.userReady(userId);

    resData = { code: 0 };
    send(MessageType.readyResponse, resData);
  };

  // 反准备
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
    console.warn(`no such ${type} method`);
  }
}

export default handle;

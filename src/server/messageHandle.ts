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
  LeaveRoomNotify
} from "./protocol";
import MessageType from "./messageType";
import roomMgr from "./roomMgr";
import { RoomStatus } from "./room";

let genDict = (socket: Socket) => {
  let dict: { [type: string]: (data: any) => void } = {};

  let send = (type: MessageType, data: any) => socket.send(type, data);
  let notify = (type: MessageType, data: any) =>
    socket.broadcast.send(type, data);
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
    let data: LobbyResponse = { code: 0, list: roomMgr.getLobbyInfo() };
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
    // 如果已经在房间了,就不能进入了
    let ids = Object.keys(socket.rooms);
    if (ids.length > 0) {
      resData = { code: -1, message: "已经在房间了" };
      send(MessageType.enterRoomResponse, resData);
      return;
    }

    let room = roomMgr.find(roomId);
    if (room) {
      if (room.userIdList.length === 2) {
        resData = { code: -3, message: "房间已经满员了" };
        send(MessageType.enterRoomResponse, resData);
        return;
      }
      resData = { code: 0 };
      // socket 加入房间
      socket.join(roomId);
      room.userIdList.push(userId);
      if (room.userIdList.length === 2) {
        room.status = RoomStatus.full;
      }
      send(MessageType.enterRoomResponse, resData);

      // 通知
      notiData = { info: roomMgr.getRoomInfo(room) };
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
    // 查看现在是不是在房间中
    let ids = Object.keys(socket.rooms);
    if (ids.length === 0) {
      resData = { code: -1, message: "并未在任何房间" };
      send(MessageType.leaveRoomResponse, resData);
      return;
    }

    let roomId = ids[0];
    let room = roomMgr.find(roomId);
    if (!room) {
      resData = { code: -2, message: "找不到该id的房间" };
      send(MessageType.leaveRoomResponse, resData);
      return;
    }

    socket.leave(roomId);
    room.userIdList = room.userIdList.filter(id => id !== userId);
    room.status = RoomStatus.notFull;
    resData = { code: 0 };
    send(MessageType.leaveRoomResponse, resData);

    // 通知
    notiData = { userId };
    notifyInRoom(roomId, MessageType.leaveRoomNotify, notiData);
  };

  // 准备
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
  genDict(socket)[type](data);
}

export default handle;

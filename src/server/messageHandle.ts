import { Socket } from "socket.io";
import {
  ChatRequest,
  RoomListResponse,
  RoomEnterRequest,
  RoomEnterResponse
} from "./protocol";
import MessageType from "./messageType";
import roomMgr from "./roomMgr";

let genDict = socket => {
  let dict: { [type: string]: (data: any) => void } = {};

  // 聊天
  dict[MessageType.chat] = (data: ChatRequest) => {
    socket.broadcast.emit(MessageType.chat, {
      type: MessageType.chat,
      data
    });
  };

  // 查询房间列表
  dict[MessageType.roomList] = () => {
    let data: RoomListResponse[] = roomMgr.toString();
    socket.emit("message", { type: MessageType.roomList, data });
  };

  // 创建房间
  //   dict[MessageType.createRoom]=({roomName:string})=>{
  //       let room :RoomDataType= {title:'',}
  //   };

  // 进入房间
  dict[MessageType.enterRoom] = (data: RoomEnterRequest) => {
    let id = data.id;
    let room = roomMgr.find(id);
    let resData: RoomEnterResponse;
    if (room) {
      resData = {};
    } else {
    }
  };

  // 离开房间
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

import { Socket } from "socket.io";

enum MessageType {
  chat = "chat",
  roomList = "roomList",
  createRoom = "createRoom",
  enterRoom = "enterRoom",
  leaveRoom = "leaveRoom",
  ready = "ready",
  unReady = "unReady",
  chooseChess = "chooseChess",
  unChooseChess = "unChooseChess",
  unChooseSkill = "unChooseSkill",
  surrend = "surrend",
  castSkill = "castSkill"
}

// 聊天数据格式
type chatDataType = { text: string };

// 游戏房间列表数据格式
type roomStatus = "beforeEnter" | "beforeReady" | "play" | "gameover";
type roomDataType = { title: string; status: string };

let genDict = socket => {
  let dict: { [type: string]: (data: any) => void } = {};

  // 聊天
  dict[MessageType.chat] = (data: chatDataType) => {
    socket.broadcast.emit(("message" = "message"), {
      type: MessageType.chat,
      data
    });
  };

  // 查询房间列表
  dict[MessageType.roomList] = () => {
    let data: roomDataType[] = [];
    socket.emit("message", { type: MessageType.roomList, data });
  };

  // 创建房间
  dict[MessageType.createRoom];

  // 进入房间
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

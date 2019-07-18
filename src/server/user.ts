// 枚举 用户准备状态
export enum UserStatus {
  // 未准备
  notReady = "notReady",
  // 准备中
  ready = "ready"
}

// 用户实体类
class User {
  // socket.id
  id: string;
  // 房间id
  roomId: string;
  // 用户准备状态
  status: UserStatus;
}

export default User;

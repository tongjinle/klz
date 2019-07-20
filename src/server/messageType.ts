enum MessageType {
  // 聊天
  chatRequest = "chatRequest",
  chatResponse = "chatResponse",
  chatNotify = "chatNotify",
  // 大厅
  lobbyRequest = "lobbyRequest",
  lobbyResponse = "lobbyResponse",
  lobbyNotify = "lobbyNotify",
  // 创建房间(暂时没有用)
  createRoomRequest = "createRoomRequest",
  createRoomResponse = "createRoomResponse",
  createRoomNotify = "createRoomNotify",
  // 进入房间
  enterRoomRequest = "enterRoomRequest",
  enterRoomResponse = "enterRoomResponse",
  enterRoomNotify = "enterRoomNotify",
  // 离开房间
  leaveRoomRequest = "leaveRoomRequest",
  leaveRoomResponse = "leaveRoomResponse",
  leaveRoomNotify = "leaveRoomNotify",
  // 准备
  readyRequest = "readyRequest",
  readyResponse = "readyResponse",
  readyNotify = "readyNotify",
  // 反准备
  unReadyRequest = "unReadyRequest",
  unReadyResponse = "unReadyResponse",
  unReadyNotify = "unReadyNotify",
  // 游戏开始
  gameStartRequest = "gameStartRequest",
  gameStartResponse = "gameStartResponse",
  gameStartNotify = "gameStartNotify",
  // 回合切换
  roundRequest = "roundRequest" /** 请求当前回合,而不是请求回合的切换 */,
  roundResponse = "roundResponse",
  roundNotify = "roundNotify",
  // 获取可以选择的棋子
  activeChessListRequest = "activeChessListRequest",
  activeChessListResponse = "activeChessListResponse",
  activeChessListNotify = "activeChessListNotify",
  // 选择棋子
  chooseChessRequest = "chooseChessRequest",
  chooseChessResponse = "chooseChessResponse",
  chooseChessNotify = "chooseChessNotify",
  // 获取棋子可以移动的格子
  rangeRequest = "rangeRequest",
  rangeResponse = "rangeResponse",
  rangeNotify = "rangeNotify",
  // 移动棋子
  moveChessRequest = "moveChessRequest",
  moveChessResponse = "moveChessResponse",
  moveChessNotify = "moveChessNotify",
  // 反选择棋子
  unChooseChessRequest = "unChooseChessRequest",
  unChooseChessResponse = "unChooseChessResponse",
  unChooseChessNotify = "unChooseChessNotify",
  // 获取可以选择的技能
  activeSkillListRequest = "activeSkillListRequest",
  activeSkillListResponse = "activeSkillListResponse",
  activeSkillListNotify = "activeSkillListNotify",
  // 选择技能
  chooseSkillRequest = "chooseSkillRequest",
  chooseSkillResponse = "chooseSkillResponse",
  chooseSkillNotify = "chooseSkillNotify",
  // 反选择技能
  unChooseSkillRequest = "unChooseSkillRequest",
  unChooseSkillResponse = "unChooseSkillResponse",
  unChooseSkillNotify = "unChooseSkillNotify",
  // 施放技能
  castSkillRequest = "castSkillRequest",
  castSkillResponse = "castSkillResponse",
  castSkillNotify = "castSkillNotify",
  // 投降
  surrendRequest = "surrendRequest",
  surrendResponse = "surrendResponse",
  surrendNotify = "surrendNotify",
  // 游戏结束
  gameOverRequest = "gameOver",
  gameOverResponse = "gameOverResponse",
  gameOverNotify = "gameOverNotify"
}
export default MessageType;

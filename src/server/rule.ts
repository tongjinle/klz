export default interface Rule {
  /**游戏名字 */
  gameName: string;
  /**必要游戏人数 */
  requiredPlayer: number;
}

export const KlzRule: Rule = {
  gameName: "卡拉赞象棋",
  requiredPlayer: 2
};

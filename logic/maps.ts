import { IMap, ChessType, ChessColor } from "./types";
let maps: { [name: string]: IMap } = {};

maps["normal"] = {
  seed: 1216,
  width: 8,
  height: 8,
  chessList: [
    // red
    {
      chessType: ChessType.knight,
      position: { x: 0, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.cavalry,
      position: { x: 1, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.minister,
      position: { x: 2, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.magic,
      position: { x: 3, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.king,
      position: { x: 4, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.minister,
      position: { x: 5, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.cavalry,
      position: { x: 6, y: 0 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.knight,
      position: { x: 7, y: 0 },
      color: ChessColor.red
    },

    {
      chessType: ChessType.footman,
      position: { x: 0, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 1, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 2, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 3, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 4, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 5, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 6, y: 1 },
      color: ChessColor.red
    },
    {
      chessType: ChessType.footman,
      position: { x: 7, y: 1 },
      color: ChessColor.red
    },
    // black
    {
      chessType: ChessType.knight,
      position: { x: 0, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.cavalry,
      position: { x: 1, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.minister,
      position: { x: 2, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.king,
      position: { x: 3, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.magic,
      position: { x: 4, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.minister,
      position: { x: 5, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.cavalry,
      position: { x: 6, y: 7 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.knight,
      position: { x: 7, y: 7 },
      color: ChessColor.black
    },

    {
      chessType: ChessType.footman,
      position: { x: 0, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 1, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 2, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 3, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 4, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 5, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 6, y: 6 },
      color: ChessColor.black
    },
    {
      chessType: ChessType.footman,
      position: { x: 7, y: 6 },
      color: ChessColor.black
    }
  ]
};

export default maps;

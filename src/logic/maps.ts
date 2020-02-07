import { IMap, ChessType, ChessColor } from "./types";
let maps: { [name: string]: IMap } = {};

maps["normal"] = {
  seed: 1216,
  width: 8,
  height: 8,
  chessList: [
    // red
    {
      chessType: "knight",
      position: { x: 0, y: 0 },
      color: "red"
    },
    {
      chessType: "cavalry",
      position: { x: 1, y: 0 },
      color: "red"
    },
    {
      chessType: "minister",
      position: { x: 2, y: 0 },
      color: "red"
    },
    {
      chessType: "magic",
      position: { x: 3, y: 0 },
      color: "red"
    },
    {
      chessType: "king",
      position: { x: 4, y: 0 },
      color: "red"
    },
    {
      chessType: "minister",
      position: { x: 5, y: 0 },
      color: "red"
    },
    {
      chessType: "cavalry",
      position: { x: 6, y: 0 },
      color: "red"
    },
    {
      chessType: "knight",
      position: { x: 7, y: 0 },
      color: "red"
    },

    {
      chessType: "footman",
      position: { x: 0, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 1, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 2, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 3, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 4, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 5, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 6, y: 1 },
      color: "red"
    },
    {
      chessType: "footman",
      position: { x: 7, y: 1 },
      color: "red"
    },
    // black
    {
      chessType: "knight",
      position: { x: 0, y: 7 },
      color: "black"
    },
    {
      chessType: "cavalry",
      position: { x: 1, y: 7 },
      color: "black"
    },
    {
      chessType: "minister",
      position: { x: 2, y: 7 },
      color: "black"
    },
    {
      chessType: "king",
      position: { x: 3, y: 7 },
      color: "black"
    },
    {
      chessType: "magic",
      position: { x: 4, y: 7 },
      color: "black"
    },
    {
      chessType: "minister",
      position: { x: 5, y: 7 },
      color: "black"
    },
    {
      chessType: "cavalry",
      position: { x: 6, y: 7 },
      color: "black"
    },
    {
      chessType: "knight",
      position: { x: 7, y: 7 },
      color: "black"
    },

    {
      chessType: "footman",
      position: { x: 0, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 1, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 2, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 3, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 4, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 5, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 6, y: 6 },
      color: "black"
    },
    {
      chessType: "footman",
      position: { x: 7, y: 6 },
      color: "black"
    }
  ]
};

export default maps;

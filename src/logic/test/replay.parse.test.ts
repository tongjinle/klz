// describe("read replay", () => {
//   let recoList = [
//     { round: 0, action: 12, data: { red: "jack", black: "tom" } },
//     { round: 0, action: 0, data: { seed: 1216 } },
//     { round: 0, action: 1, data: { width: 8, height: 8 } },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 1, position: { x: 0, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 2, position: { x: 1, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 3, position: { x: 2, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 4, position: { x: 3, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 5, position: { x: 4, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 3, position: { x: 5, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 2, position: { x: 6, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 1, position: { x: 7, y: 0 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 0, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 1, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 2, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 3, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 4, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 5, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 6, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 7, y: 1 }, chessColor: 0 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 1, position: { x: 0, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 2, position: { x: 1, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 3, position: { x: 2, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 5, position: { x: 3, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 4, position: { x: 4, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 3, position: { x: 5, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 2, position: { x: 6, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 1, position: { x: 7, y: 7 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 0, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 1, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 2, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 3, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 4, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 5, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 6, y: 6 }, chessColor: 1 }
//     },
//     {
//       round: 0,
//       action: 4,
//       data: { chessType: 0, position: { x: 7, y: 6 }, chessColor: 1 }
//     },
//     { round: 1, action: 6, data: { position: { x: 0, y: 1 } } },
//     { round: 1, action: 7, data: { position: { x: 0, y: 2 } } },
//     { round: 2, action: 6, data: { position: { x: 4, y: 7 } } },
//     { round: 2, action: 7, data: { position: { x: 4, y: 3 } } },
//     { round: 2, action: 8, data: { skillType: 5 } },
//     { round: 2, action: 9, data: { position: { x: 4, y: 1 } } },
//     { round: 3, action: 10 }
//   ];

//   let rep: Replay;
//   let chBoard: IChessBoard;

//   beforeAll(() => {
//     rep = new Replay();
//   });

//   it("addPlayer", () => {
//     rep.parse(recoList[0] as IRecord);

//     chBoard = rep.chBoard;

//     expect(chBoard.playerList.length).toBe(2);
//     expect(chBoard.status).toBe(ChessBoardStatus.red);
//   });

//   it("setMapSeed", () => {
//     rep.parse(recoList[1] as IRecord);
//     expect(chBoard.seed).toBe(1216);
//   });

//   it("setMapSize", () => {
//     rep.parse(recoList[2] as IRecord);
//     expect(chBoard.width).toBe(8);
//     expect(chBoard.height).toBe(8);
//   });

//   it("addChess", () => {
//     recoList.slice(3, 3 + 32).forEach(reco => {
//       rep.parse(reco as IRecord);
//     });
//     expect(chBoard.chessList.length).toBe(32);
//   });

//   it("red choose chess", () => {
//     rep.parse(recoList[35] as IRecord);
//     expect(chBoard.currChess.posi).toEqual({ x: 0, y: 1 });
//   });

//   it("red move chess", () => {
//     let ch = chBoard.currChess;

//     rep.parse(recoList[36] as IRecord);
//     expect(ch.posi).toEqual({ x: 0, y: 2 });
//   });

//   it("black choose chess(magic)", () => {
//     expect(chBoard.currPlayer.color).toBe(ChessColor.black);

//     // mock tom's energy to choose magic
//     chBoard.currPlayer.energy = 100;

//     rep.parse(recoList[37] as IRecord);
//     expect(chBoard.currChess.type).toBe(ChessType.magic);
//   });

//   it("black move chess", () => {
//     rep.parse(recoList[38] as IRecord);
//     expect(chBoard.currChess.posi).toEqual({ x: 4, y: 3 });
//   });

//   it("black cast skill", () => {
//     let ch = chBoard.currChess;

//     rep.parse(recoList[39] as IRecord);
//     rep.parse(recoList[40] as IRecord);
//     expect(chBoard.getChessByPosi({ x: 4, y: 1 })).toBeUndefined();
//     expect(ch.status).toBe(ChessStatus.rest);
//   });

//   it("red rest", () => {
//     rep.parse(recoList[41] as IRecord);
//     let red = _.find(chBoard.playerList, p => p.color == ChessColor.red);
//     let black = _.find(chBoard.playerList, p => p.color == ChessColor.black);
//     expect(red.energy).toBe(8);
//   });
// });

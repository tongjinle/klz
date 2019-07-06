// import * as _ from 'underscore';
// import {ChangeType, ActionType,  IPosition, IBox, IChessBoard, IChess, ISkill, IRecord, IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../logic/types';
// import Replay from '../logic/replay';
// import ChessBoard from '../logic/chessBoard/chessBoard';
// import * as serverTypes from './types';

// // user
// export let mockUser = function(): serverTypes.user[] {
// 	return [
// 		{ username: 'falcon', password: '', token: undefined, expires: undefined },
// 		{ username: 'mouse', password: '', token: undefined, expires: undefined },
// 		{ username: 'cat', password: '', token: undefined, expires: undefined }
// 	];
// };

// // room
// export let mockRoom = function(): Replay[] {
// 	let roomList: Replay[] = [];

// 	let rep: Replay;
// 	let chBoard: IChessBoard;

// 	// 1
// 	rep = new Replay();
// 	chBoard = rep.chBoard = new ChessBoard();
// 	chBoard.readMap('normal');
// 	chBoard.addPlayer('mouse');
// 	roomList.push(rep);

// 	// 2
// 	rep = new Replay();
// 	chBoard = rep.chBoard = new ChessBoard();
// 	chBoard.readMap('normal');
// 	chBoard.addPlayer('falcon');
// 	roomList.push(rep);

// 	// 3
// 	rep = new Replay();
// 	chBoard = rep.chBoard = new ChessBoard();
// 	chBoard.readMap('normal');
// 	chBoard.addPlayer('falcon');
// 	chBoard.addPlayer('cat');
// 	chBoard.ready('falcon', PlayerStatus.ready);
// 	chBoard.ready('cat', PlayerStatus.ready);
// 	roomList.push(rep);

// 	// 4
// 	rep = new Replay();
// 	chBoard = rep.chBoard = new ChessBoard();
// 	chBoard.readMap('normal');
// 	chBoard.addPlayer('falcon');
// 	chBoard.addPlayer('mouse');
// 	chBoard.ready('falcon', PlayerStatus.ready);
// 	chBoard.ready('mouse', PlayerStatus.ready);
// 	roomList.push(rep);

// 	// 5
// 	rep = new Replay();
// 	chBoard = rep.chBoard = new ChessBoard();
// 	chBoard.readMap('normal');
// 	chBoard.addPlayer('cat');
// 	roomList.push(rep);

// 	return roomList;

// };

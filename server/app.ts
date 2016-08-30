/// <reference path="../typings/index.d.ts" />

// import express = require("express");
import * as express from "express";
import * as _ from 'underscore';
import {ActionType, IRoomInfo, IPosition, IBox, IChessBoard, IChess, ISkill,   IRecord,    IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../logic/types';
import Replay from '../logic/replay';
import ChessBoard from '../logic/chessBoard/chessBoard';

// import * as cookieSession from 'cookie-session';
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

type Request = express.Request;
type Response = express.Response;

console.log(new Date().toLocaleString());

var app = express();
var router = express.Router();
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2']
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(function (req, res, next) {
//   // Update views
//   req.session.views = (req.session.views || 0) + 1

//   // Write response
//   res.end(req.session.views + ' views')
// })


app.all('*', (req: Request, res: Response, next) => {
	// console.log('set header');
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

app.use('/user/*', (req: Request, res: Response, next) => {
	console.log('check login');
	if (req['session'] && req['session'].username) {
		next();
	} else {
		res.json({ flag: false });
	}
});


app.get('/', function(req, res) {
	console.log('root');
	res.send('Hello World21!');
});

// app.all('*', () => {
// 	console.log('after root');
// });


// 登录
let users = [
	{ username: 'falcon', password: '' },
	{ username: 'mouse', password: '' },
	{ username: 'cat', password: '' }
];

app.post('/login', function(req: Request, res: Response) {
	let username: string = req.params['username'];
	let password: string = req.params['password'];

	let flag = !!_.find(users, u => u.username == username && u.password == password);
	if (flag) {
		let session = req['session'];
		session.username = username;
	}
	let rst = { flag };
	res.json(rst);
});

app.get('/user/getMyUsername', (req: Request, res: Response) => {
	res.json({ username: req['session'].username });
});

// 获取大厅棋盘
let roomList: Replay[] = [
	// { id: 1, name: 'room0', usernameList: ['mouse'], status: 0 },
	// { id: 2, name: 'room1', usernameList: ['falcon'], status: 0 },
	// { id: 3, name: 'room2', usernameList: ['falcon', 'cat'], status: 1 },
	// { id: 4, name: 'room3', usernameList: ['falcon', 'mouse'], status: 1 },
	// { id: 5, name: 'room4', usernameList: ['cat'], status: 0 }
];

// mock
(function(roomList: Replay[]) {
	let rep: Replay;
	let chBoard: IChessBoard;

	// 1
	rep = new Replay();
	chBoard = rep.chBoard = new ChessBoard();
	chBoard.readMap('normal');
	chBoard.addPlayer('mouser');
	roomList.push(rep);

	// 2
	rep = new Replay();
	chBoard = rep.chBoard = new ChessBoard();
	chBoard.readMap('normal');
	chBoard.addPlayer('falcon');
	roomList.push(rep);

	// 3
	rep = new Replay();
	chBoard = rep.chBoard = new ChessBoard();
	chBoard.readMap('normal');
	chBoard.addPlayer('falcon');
	chBoard.addPlayer('cat');
	chBoard.ready('falcon', PlayerStatus.ready);
	chBoard.ready('cat', PlayerStatus.ready);
	roomList.push(rep);


	// 4
	rep = new Replay();
	chBoard = rep.chBoard = new ChessBoard();
	chBoard.readMap('normal');
	chBoard.addPlayer('falcon');
	chBoard.addPlayer('mouse');
	chBoard.ready('falcon', PlayerStatus.ready);
	chBoard.ready('mouse', PlayerStatus.ready);
	roomList.push(rep);

	// 5
	rep = new Replay();
	chBoard = rep.chBoard = new ChessBoard();
	chBoard.readMap('normal');
	chBoard.addPlayer('cat');
	roomList.push(rep);


})(roomList);


// 获取所有房间
app.get('user/roomList', (req: Request, res: Response) => {
	let isMine: boolean = !!req.query['isMine'];
	let status: number = req.query['status'] - 0;
	let pageIndex: number = req.query['pageIndex'] - 0;
	let pageSize: number = req.query['pageSize'] - 0;


	let list = _(roomList).filter(ro => status == -1 ? true : ro.chBoard.status == status);

	if (isMine) {
		let username = req['session'].username;
		if (username) {
			list = _(list).filter(ro => ro.chBoard.playerList.indexOf(username) >= 0);
		}
	}

	let totalCount = list.length;
	list = list.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

	let rst = {
		flag: true,
		roomList: list,
		totalCount
	};

	res.json(rst);
});


function getRoomInfo(roomId: number): IRoomInfo {
	let info: IRoomInfo;
	return info;
}



// 创建房间
app.post('/user/createRoom', (req: Request, res: Response) => {
	let username = req['session'].username;

	let rep: Replay = new Replay();
	let chBoard: IChessBoard = rep.chBoard = new ChessBoard();
	chBoard.readMap('normal');
	roomList.push(rep);
});

// 进入某个房间
app.post('/user/enterRoom/:roomId', (req: Request, res: Response) => {
	let roomId: number = parseInt(req['body'].roomId);


	let info = getRoomInfo(roomId);
	let flag: boolean = !!info;
	let rst = {
		flag,
		info
	};

	if (flag) {
		// 当前房间
		req['session'].roomId = roomId;
	}

	res.json(rst);

});

// 刷新页面
app.get('/user/refresh', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let info = getRoomInfo(roomId);

	let flag: boolean = false;
	if (info) {
		flag = true;
		res.json({ flag, info });
	} else {
		res.json({ flag });
	}
});

// 请求可以被选择的棋子
app.get('/user/getActiveChessList', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);

	if (!rep) {
		res.json({ flag: false });
	}

	let chBoard: IChessBoard = rep.chBoard;

	let chessIdList: number[] = _.map(chBoard.getActiveChessList(), ch => ch.id);

	res.json({ flag: true, chessIdList });
});

// 选择棋子(包括反选)
app.get('/user/chooseChess', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({ flag: false });
	}

	let chBoard: IChessBoard = rep.chBoard;
	let ch = chBoard.getChessByPosi(req['body'].position);
	chBoard.chooseChess(ch);
});

// 移动棋子
app.get('/user/moveChess', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({ flag: false });
	}

	let chBoard: IChessBoard = rep.chBoard;
	chBoard.moveChess(req['body'].position);

	let changes = chBoard.getLastChange();

	res.json({
		flag: true,
		changes
	});

});

// 请求可以被选择的技能
app.get('/user/getActiveSkillList', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({ flag: false });
	}

	let chBoard: IChessBoard = rep.chBoard;
	if (!chBoard.currChess) {
		res.json({ flag: false });
	}


	let skillIdList = chBoard.currChess.canCastSkillList.map(sk => sk.id);
	res.json({
		flag: true,
		skillIdList
	});

});

// 选择技能(包括反选)
app.post('/user/chooseSkillTarget', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({flag:false});
	}

	

	let chBoard: IChessBoard = rep.chBoard;
	let skillId = req.params['skillId'];

	let sk:ISkill = _(chBoard.currChess.skillList).find(sk=>sk.id == skillId);
	if(!sk){
		res.json({ flag: false });

	}

	chBoard.chooseSkill(sk.type);
});


// 使用技能
app.post('/user/chooseChess', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({flag:false});
	}

	let chBoard: IChessBoard = rep.chBoard;

	if(!chBoard.currSkill){
		res.json({flag:false});
	}

	chBoard.chooseSkillTarget(req['body'].position);
	let changes = chBoard.getLastChange();
	res.json({
		flag:true,
		changes
	});

});








var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

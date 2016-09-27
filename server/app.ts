/// <reference path="../typings/index.d.ts" />

/// <reference path="./types" />

import * as express from "express";
import * as _ from 'underscore';
import {ChessBoardStatus, ChangeType, ActionType, IRoomInfo, IPosition, IBox, IChessBoard, IChess, ISkill, IRecord, IPlayer, ChessColor, ChessType, ChessStatus, PlayerStatus, SkillType } from '../logic/types';
import Replay from '../logic/replay';
import ChessBoard from '../logic/chessBoard/chessBoard';
import tokenGen from './tokenGen';
import {mockRoom,mockUser} from './mock';



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


app.all('*', (req: Request, res: Response, next) => {
	// console.log('set header');
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});



app.use('/user/*', (req: Request, res: Response, next) => {
	console.log(req.method);
	if(req.method == 'OPTIONS'){
		console.log('today is options...')
		next();
		
		return;
	}
	console.log('check user');
	console.log(req.originalUrl);
	let token = req['token'] = req.params['token'] || req.query['token'] || req['body'].token;
	console.log('token:', token);
	let user = token && getUserByToken(token);
	if (user) {
		req['user'] = user;

		let roomId = req.params['roomId'] || req.query['roomId'] || req['body'].roomId;
		if(roomId != undefined){
			let room = req['room'] = _.find(roomList,(ro:Replay)=>ro.id == roomId);
			if(room==undefined){
				res.json({
					flag:false,
					errMsg:'room not exist'
				});
			}
		}
		next();
	} else {
		console.log(token,'fail check');
		res.json({ flag: false });
		res.end();
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

// mock
let users = mockUser();
let roomList = mockRoom();


let getUserByToken = (token: string) => _.find(users, u => u.token == token && u.expires > + new Date);

app.post('/login', function(req: Request, res: Response) {
	let username: string = req['body'].username;
	let password: string = req['body'].password;
	let user = _.find(users, u => u.username == username && u.password == password);
	let flag: boolean = !!user;
	if (flag) {
		user.token = tokenGen();
		let maxAge: number = 2 * 60 * 60 * 1000;
		user.expires = (+new Date) + maxAge;
	}
	let rst = { flag, token: user.token };
	res.json(rst);
});

app.post('/logout', function(req: Request, res: Response) {
	let token = req['body'].token;
	let user = _.find(users, u => u.token == token);
	if (user) {
		user.token = undefined;
		user.expires = undefined;
	}
	let flag: boolean = !!user;
	let rst = { flag };
	res.json(rst);
});

app.get('/user/getMyUsername', (req: Request, res: Response) => {
	res.json({ flag: true, username: req['user'].username });
});




// 获取所有房间
app.get('/user/roomList', (req: Request, res: Response) => {
	let isMine: boolean = (!!(parseInt( req.query['isMine']))) as boolean;
	let status: number = parseInt( req.query['status']) ;
	let pageIndex: number = parseInt(req.query['pageIndex']) ;
	let pageSize: number = parseInt(req.query['pageSize']);

	let list = _(roomList).filter(ro => status == -1 ? true : ro.chBoard.status == status);
	
	if (isMine) {
		let username = req['user'].username;
		if (username) {
			list = _(list).filter(ro => ro.chBoard.playerList.indexOf(username) >= 0);
		}
	}

	let totalCount = list.length;
	list = list.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

	let rst = {
		flag: true,
		roomList: list.map(ro => getRoomInfo(ro.id)),
		totalCount
	};

	res.json(rst);
});





function getRoomInfo(roomId: number): IRoomInfo {
	let room = _.find(roomList, ro => ro.id == roomId);
	if (!room) {
		return null;
	}

	let chBoard = room.chBoard;
	let info: IRoomInfo = {} as IRoomInfo;

	info.id =room.id;
	info.currChessId = chBoard.currChess && chBoard.currChess.id;
	info.currPlayerName = chBoard.currPlayer && chBoard.currPlayer.name;
	info.currSkillId = chBoard.currSkill && chBoard.currSkill.id;
	info.height = chBoard.height;
	info.playerList = chBoard.playerList
		&& chBoard.playerList.map(p => {
			return {
				playerName: p.name,
				status: p.status,
				chStatus: p.chStatus,
				playerColor:p.color,
				energy:p.energy
			};
		});
	info.roundIndex = chBoard.roundIndex;
	info.chessList = chBoard.currPlayer && 
		chBoard.chessList
		.map(ch=>{
			return {
				id:ch.id,
				color:ch.color,
				type:ch.type,
				posi:ch.posi,
				hp:ch.hp,
				maxhp:ch.maxhp,
				status:ch.status,
				energy:ch.energy
			};
		});
	info.skillList = chBoard.currChess && chBoard.currChess.skillList.map(sk => {
		return {
			id: sk.id,
			chessId: sk.owner.id,
			type: sk.type,
			maxcd: sk.maxcd,
			cd: sk.cd
		};
	});
	info.status = chBoard.status;
	info.width = chBoard.width;

	return info;



}



// 创建房间
app.post('/user/createRoom', (req: Request, res: Response) => {
	let user = req['user'] as serverTypes.user;
	// 一个人最多10盘棋
	let maxCount = 10;
	let count:number  = _.filter<Replay>(roomList,(room)=>{
		let chBoard = room.chBoard;
		return chBoard.status != ChessBoardStatus.gameOver && !!_.find(chBoard.playerList,(p)=>{return p.name == user.username;});
	}).length;

	if(count<maxCount){
		let rep: Replay = new Replay();
		let chBoard: IChessBoard = rep.chBoard = new ChessBoard();
		chBoard.readMap('normal');
		chBoard.addPlayer(user.username);
		chBoard.ready(user.username,PlayerStatus.ready);
		roomList.push(rep);
		res.json({flag:true});
	}else{
		res.json({flag:false});
	}

	
});

// 加入房间
app.post('/user/joinRoom',(req:Request,res:Response)=>{
	let user = req['user'] as serverTypes.user;
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;
	
	if(chBoard.status == ChessBoardStatus.beforeStart && !_.find(chBoard.playerList,p=>p.name == user.username)){
		chBoard.addPlayer(user.username);
		res.json({
			flag:true
		});
	}else{
		res.json({
			flag:false
		});
	}
});

// 退出房间
app.post('/user/quitRoom',(req:Request,res:Response)=>{
	let user = req['user'] as serverTypes.user;
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;

	if(chBoard.status == ChessBoardStatus.beforeStart){
		let flag = chBoard.removePlayer(user.username);
		res.json({flag});
	}else{
		res.json({flag:false});
	}

});


// 进入某个房间
app.get('/user/getRoomInfo/:roomId', (req: Request, res: Response) => {
	let roomId: number = parseInt(req.params['roomId']);

	let info = getRoomInfo(roomId);
	let flag: boolean = !!info;
	let rst = {
		flag,
		info
	};

	if (flag) {
		// 当前房间
		req['user'].roomId = roomId;
	}

	res.json(rst);

});


// 玩家状态选择
app.post('/user/setStatus',(req:Request,res:Response)=>{
	let user:serverTypes.user = req['user'] as serverTypes.user;
	let status  = req['body'].status as PlayerStatus;

	let room = req['room'] as Replay;
	let chBoard = room.chBoard;
	chBoard.ready(user.username,status);
	res.json({
		flag:true
	});

});




// 心跳
app.get('/user/heartBeat',(req: Request, res: Response)=>{
	let room :Replay = req['room'] as Replay; 
	let chBoard: IChessBoard = room.chBoard;
	let user = getUserByToken(req['token']);

	let lastRound = chBoard.roundIndex;

	let interval = 5 * 1000;
	let max = 6;

	let index = 0;
	let t = setInterval(()=>{
		if(chBoard.roundIndex>lastRound){
			res.json({
				flag:true,
				isNew:true
			});
			clearInterval(t);
		}else{
			index++;
			if(index == max){
				res.json({
					flag:true,
					isNew:false
				});
				clearInterval(t);
			}
		}
	},interval);

});

// 刷新页面
app.get('/user/refresh', (req: Request, res: Response) => {
	let roomId: number = req['session'].roomId;
	console.log('session rid->',req['session'].roomId);
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
// params
/*
	roomId:number
*/
app.get('/user/getActiveChessList', (req: Request, res: Response) => {
	let room :Replay = req['room'] as Replay; 
	let chBoard: IChessBoard = room.chBoard;

	let chessIdList: number[] = _.map(chBoard.getActiveChessList(), ch => ch.id);

	res.json({ flag: true, chessIdList });
});

// 选择棋子
app.post('/user/chooseChess', (req: Request, res: Response) => {
	let roomId: number = req['body'].roomId;
	let position:IPosition = req['body'].position;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({ flag: false });
	}

	let chBoard: IChessBoard = rep.chBoard;
	let ch = chBoard.getChessByPosi(position);
	chBoard.chooseChess(ch);

	res.json({flag:true});
});

// 选择棋子测试方法
// 故意让让它不进入'/user/*'中间件
// app.post('/chooseChess',(req: Request, res: Response)=>{
// 	let token :number = req['body'].token;
// 	let roomId :number = req['body'].roomId;
// 	let position :IPosition = req['body'].position;

// 	let rep: Replay = _.find(roomList, ro => ro.id == roomId);

// });

// 反选棋子
app.post('/user/unChooseChess',(req:Request,res:Response)=>{
	let roomId: number = req['body'].roomId;
	let rep: Replay = _.find(roomList, ro => ro.id == roomId);


	if (!rep) {
		res.json({ flag: false });
	}

	let chBoard: IChessBoard = rep.chBoard;
	chBoard.unChooseChess();
	res.json({flag:true});
});

// 	获取当前棋子可以活动的区域格子
app.get('/user/getMoveRange',(req:Request,res:Response)=>{
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;

	let positionList =	chBoard.currChess.getMoveRange();
	res.json({
		flag:true,
		positionList
	});

});


// 移动棋子
app.post('/user/moveChess', (req: Request, res: Response) => {
	let room = req['room'] as Replay;
	let position = req['body'].position as IPosition;

	let chBoard = room.chBoard;
	let round = chBoard.roundIndex;
	
	chBoard.moveChess(position);

	let changes = chBoard.chgTable
		.queryByRound(round)
		.queryByChangeType(ChangeType.position)
		.toList();

	res.json({
		flag: true,
		changes
	});

});

// 请求可以被选择的技能
app.get('/user/getActiveSkillList', (req: Request, res: Response) => {
	let room = req['room'] as Replay;
	let skillId:number = req['body'].skillId as number;

	let chBoard: IChessBoard = room.chBoard;


	let skillList = chBoard.currChess.skillList.map(sk => {
		return {
			id:sk.id,
			isActive:sk.getCastRange().length>0,
			type:sk.type
		};
	});

	res.json({
		flag: true,
		skillList
	});

});

// 选择技能
app.post('/user/chooseSkill', (req: Request, res: Response) => {
	let room = req['room'] as Replay;
	let skillId:number = req['body'].skillId as number;
	let chBoard: IChessBoard = room.chBoard;




	let sk: ISkill = _(chBoard.currChess.skillList).find(sk => sk.id == skillId);
	

	chBoard.chooseSkill(sk.type);
	res.json({
		flag:true

	});
});

// 反选技能
app.post('/user/unChooseSkill', (req: Request, res: Response) => {
	let room = req['room'] as Replay;
	let chBoard: IChessBoard = room.chBoard;

	chBoard.unChooseSkill();
	res.json({
		flag:true

	});
});



// 获取当前技能的target列表
app.get('/user/getSkillTargetList',(req: Request, res: Response)=>{
	let room = req['room'] as Replay;
	let chBoard: IChessBoard = room.chBoard;

	let positionList = chBoard.currSkill.getCastRange();

	res.json({
		flag:true,
		positionList
	});

});

// 施放技能
app.post('/user/chooseSkillTarget',(req:Request,res:Response)=>{
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;

	let posi = req['body'].position as IPosition;

	let round = chBoard.roundIndex;

	chBoard.chooseSkillTarget(posi);
	
	
	let changes = chBoard.chgTable
		.queryByRound(round)
		.queryByChangeType(ChangeType.hp)
		.toList();

	

	res.json({
		flag: true,
		changes
	});
});

// 休息
app.post('/user/rest', (req: Request, res: Response) => {
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;

	chBoard.rest();

	let changes;// = chBoard.getLastChange();
	res.json({
		flag: true,
		changes
	});

});

// 投降
app.post('/user/surrend',(req:Request,res:Response)=>{
	let user = req['user'] as serverTypes.user;
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;

	chBoard.surrender(user.username);
	res.json({
		flag:true
	});
});

// 获取胜负
app.get('/user/judge',(req:Request,res:Response)=>{
	let room = req['room'] as Replay;
	let chBoard = room.chBoard;

	let judge = chBoard.judge();
	res.json({
		flag:true,
		judge
	});
});








var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

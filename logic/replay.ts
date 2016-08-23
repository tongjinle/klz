/// <reference path="../typings/index.d.ts" />


import ChessBoard from './chessBoard/chessBoard';
import {PlayerStatus, ActionType, IRecord, SkillType, ChessColor, ChessType, IPosition, IChess} from './types';
import Chess from './chess/chess';
import chessList from './chess/chessList';
import _ = require("underscore");



export default class Replay {
	constructor() {
		this.recoList = [];

	}
	seed: number;
	chBoard: ChessBoard;
	recoList: IRecord[];
	parse(reco: IRecord): void {
		this.chBoard = this.chBoard || new ChessBoard();

		this.parseDict[reco.action](reco.data);
		this.recoList.push(reco);
	}

	// query(action: ActionType, condi: { [key: string]: any }): IRecord[] {
	// 	let recoList: IRecord[];
	// 	recoList = _.filter(this.recoList, reco =>
	// 		(action ? reco.action == action : true) &&
	// 		(condi ? _.all(condi, (v, k) => reco[k] == v) : true)
	// 	);
	// 	return recoList;
	// }

	// 链式写法 
	private queryRecoList:IRecord[];
	queryByRound(round:number):Replay{
		this.queryRecoList = this.queryRecoList || this.recoList;
		this.queryRecoList = _.filter(this.queryRecoList,reco=>reco.round == round);
		return this;
	}

	queryByActionType(action:ActionType):Replay{
		this.queryRecoList = this.queryRecoList || this.recoList;
		this.queryRecoList = _.filter(this.queryRecoList,reco=>reco.action == action);
		return this;
	}

	queryByParams(params):Replay{
		this.queryRecoList = this.queryRecoList || this.recoList;
		let isMatch = (oa,ob):boolean=>{
			let flag:boolean = false;

			if(_.isObject(oa) && _.isObject(ob)){
				_.find(ob,(obv,k)=>{
					let oav = oa[k];
					flag = isMatch(oav,obv);
					if(!flag){return true;}
				});
			}else if(_.isArray(oa) && _.isArray(ob)){
				_.find(ob,(obv,i)=>{
					let oav = oa[i];
					flag = isMatch(oav,obv);
					if(!flag){return true;}
				});
			}else{
				return oa === ob;
			}
			
			return flag;
		};
		this.queryRecoList = _.filter(this.queryRecoList,reco =>isMatch(reco.data,params));
		return this;
	}

	toList():IRecord[]{
		let rst :IRecord[] = this.queryRecoList;
		this.queryRecoList = undefined;
		return rst;
	}


	private parseDict: { [action: number]: (data: {}) => void } = {
		[ActionType.addPlayer]:(data:{red:string,black:string})=>{
			this.chBoard.addPlayer(data.red);
			this.chBoard.addPlayer(data.black);

			this.chBoard.ready(data.red,PlayerStatus.ready);
			this.chBoard.ready(data.black,PlayerStatus.ready);
		},
		[ActionType.setMapSeed]: (data: { seed: number }) => {
			this.chBoard.setMapSeed(data.seed);
		},
		[ActionType.setMapSize]: (data: { width: number, height: number }) => {
			this.chBoard.setMapSize(data.width, data.height);
		},

		[ActionType.setMapChess]: (data: { chessList: { chType: ChessType, color: ChessColor, posi: IPosition }[] }) => {
			this.chBoard.setMapChess(data.chessList);
		},

		[ActionType.readMap]: (data: { mapName: string }) => {
			this.chBoard.readMap(data.mapName);
		},

		[ActionType.addChess]: (data: { chessType: ChessType, position: IPosition, chessColor: ChessColor }) => {
			let ch: IChess = Chess.createChessByType(data.chessType);
			ch.color = data.chessColor;
			ch.posi = data.position;
			this.chBoard.addChess(ch);
		},
		[ActionType.removeChess]: (data: { position: IPosition }) => {
			this.chBoard.removeChess(this.chBoard.getChessByPosi(data.position));
		},
		[ActionType.chooseChess]: (data: { position: IPosition }) => {
			let ch = this.chBoard.getChessByPosi(data.position);
			this.chBoard.chooseChess(ch);
		},
		[ActionType.moveChess]: (data: { position: IPosition }) => {
			this.chBoard.moveChess(data.position)
		},
		[ActionType.chooseSkill]: (data: { skillType: SkillType }) => {
			this.chBoard.chooseSkill(data.skillType);
		},
		[ActionType.castSkill]: (data: { position: IPosition }) => {
			this.chBoard.chooseSkillTarget(data.position);
		},
		[ActionType.rest]: () => {
			this.chBoard.rest();
		}
	};



}











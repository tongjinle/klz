import {IMap, ChessType, ChessColor} from './types';
let maps: { [name: string]: IMap } = {};

maps['normal'] = {
	seed:1216,
	width: 8,
	height: 8,
	chessList: [
		// red
		{ chType: ChessType.knight, posi: { x: 0, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.cavalry, posi: { x: 1, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.minister, posi: { x: 2, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.magic, posi: { x: 3, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.king, posi: { x: 4, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.minister, posi: { x: 5, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.cavalry, posi: { x: 6, y: 0 }, color: ChessColor.red },
		{ chType: ChessType.knight, posi: { x: 7, y: 0 }, color: ChessColor.red },

		{ chType: ChessType.footman, posi: { x: 0, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 1, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 2, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 3, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 4, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 5, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 6, y: 1 }, color: ChessColor.red },
		{ chType: ChessType.footman, posi: { x: 7, y: 1 }, color: ChessColor.red },
		// black
		{ chType: ChessType.knight, posi: { x: 0, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.cavalry, posi: { x: 1, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.minister, posi: { x: 2, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.magic, posi: { x: 3, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.king, posi: { x: 4, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.minister, posi: { x: 5, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.cavalry, posi: { x: 6, y: 7 }, color: ChessColor.black },
		{ chType: ChessType.knight, posi: { x: 7, y: 7 }, color: ChessColor.black },

		{ chType: ChessType.footman, posi: { x: 0, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 1, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 2, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 3, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 4, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 5, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 6, y: 6 }, color: ChessColor.black },
		{ chType: ChessType.footman, posi: { x: 7, y: 6 }, color: ChessColor.black },
	]
};


export default maps;
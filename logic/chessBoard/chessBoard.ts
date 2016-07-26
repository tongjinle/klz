import {IPosition, IChess, IChessBoard, IBox} from '../types';

class ChessBoard implements IChessBoard {
	chessList: IChess[];
	boxList: IBox[];
	constructor(public width: number, public height: number) {
		this.chessList = [];
		this.boxList = [];
	}
}

export default ChessBoard;
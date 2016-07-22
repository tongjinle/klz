import {Footman} from './footman';
import {Cavalry} from './cavalry';

let chessList = {
	[ChessType.footman]:Footman,
	[ChessType.cavalry]:Cavalry
	
};

export default chessList;
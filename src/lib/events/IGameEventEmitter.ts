
import GameEvent from "./GameEvent";
interface IGameEventEmitter {

	fireEvent(event: GameEvent): void;

}

export default IGameEventEmitter;
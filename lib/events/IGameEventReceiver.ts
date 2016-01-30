import GameEvent from "./GameEvent";

interface IGameEventReceiver {
	receiveEvent(event: GameEvent): void;
}

export default IGameEventReceiver;
import {EventEmitter} from "events";
import Game from "../Game";
import IComponent from "./IComponent";
import GameEvent from "../events/GameEvent";
import IGameEventEmitter from "../events/IGameEventEmitter";

abstract class UIElement implements IComponent, IGameEventEmitter {

	protected game: Game;
	private eventEmitter:EventEmitter;

	constructor(game: Game) {
		this.game = game;
		this.eventEmitter = new EventEmitter();

		this.setup();
	}

	abstract setup(): void;

	// Methods from IComponent
	abstract loadState(entityData:any):void;

	abstract tick(delta:number, now:number):void;

	abstract receiveEvent(event: GameEvent): void;

	public fireEvent(event: GameEvent): void {
		console.group("Firing event up to Game: "+event.name);
		this.game.fireEvent(event);
		console.groupEnd();
	}

}

export default UIElement;

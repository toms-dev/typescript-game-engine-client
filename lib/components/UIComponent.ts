import {EventEmitter} from "events";
import IComponent from "./IComponent";
import GameEvent from "../events/GameEvent";

abstract class UIElement implements IComponent {

	public eventEmitter:EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	abstract setup(): void;

	// Methods from IComponent
	abstract loadState(entityData:any):void;

	abstract tick(delta:number, now:number):void;

	abstract receiveEvent(event: GameEvent): void;

}

export default UIElement;

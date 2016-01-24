import {EventEmitter} from "events";
import IComponent from "./IComponent";

abstract class UIElement implements IComponent {

	public eventEmitter:EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	abstract setup(): void;

	// Methods from IComponent
	abstract loadState(entityData:any):void;

	abstract tick(delta:number, now:number):void;

}

export default UIElement;

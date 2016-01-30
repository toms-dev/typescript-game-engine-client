
import IComponent from "./IComponent";
import ComponentBag from "./ComponentBag";
import GameEvent from "../events/GameEvent";

abstract class Component implements IComponent {

	public parent: ComponentBag;

	constructor(parent: ComponentBag) {
		this.parent = parent;
	}

	abstract tick(delta:number, now:number):void;

	abstract loadState():any;

	abstract receiveEvent(event: GameEvent): void;

}

export default Component;
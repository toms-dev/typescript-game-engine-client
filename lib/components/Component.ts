
import IComponent from "./IComponent";
import ComponentBag from "./ComponentBag";

abstract class Component implements IComponent {

	public parent: ComponentBag;

	constructor(parent: ComponentBag) {
		this.parent = parent;
	}

	abstract tick(delta:number, now:number):void;

	abstract loadState():any;

	abstract receiveEvent(eventName: string, args: any[]): void;

}

export default Component;
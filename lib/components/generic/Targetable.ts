
import Entity from "../../Entity";
import IComponent from "../IComponent";
import GameEvent from "../../events/GameEvent";
export default class Targetable implements IComponent {

	private targeted: boolean;
	private entity: Entity;

	constructor(entity: Entity) {
		this.entity = entity;
		this.targeted = false;
	}

	receiveEvent(event: GameEvent): void {
	}

	loadState(entityData:any):void {
	}

	tick(delta:number):void {
	}
}
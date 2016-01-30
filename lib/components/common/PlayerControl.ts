
import IComponent from "./../IComponent";
import GameEvent from "../../events/GameEvent";
export default class PlayerControlled implements IComponent {

	private focused: boolean;

	constructor() {
		this.focused = false;
	}

	focus(): void {
		this.focused = true;
	}

	unfocus(): void {
		this.focused = false;
	}

	isFocused(): boolean {
		return this.focused;
	}

	receiveEvent(event: GameEvent): void {
	}

	loadState(entityData:any):void {
	}

	tick(delta:number):void {
	}
}
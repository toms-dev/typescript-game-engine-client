import IComponent from "./components/IComponent";
import Game from "./Game";
import IEventReceiver from "./events/IGameEventReceiver";
import GameEvent from "./events/GameEvent";
import IGameEventEmitter from "./events/IGameEventEmitter";
import IGameEventReceiver from "./events/IGameEventReceiver";

export default class Entity implements IGameEventEmitter, IGameEventReceiver {

	public guid: number;
	protected components:IComponent[];
	private debugRawData: any;
	public game: Game;

	constructor(game: Game, guid: number = 0) {
		this.game = game;
		this.guid = guid;
		this.components = [];
	}

	tick(delta:number, now: number) {
		for (var i = 0; i < this.components.length; ++i) {
			var comp = this.components[i];
			comp.tick(delta, now);
		}
	}

	emitEventFromName(name: string, args: any[]): void {
		var event = new GameEvent(name, args, this);
		this.fireEvent(event);
	}

	fireEvent(event: GameEvent): void {
		//var targets = (<IEventReceiver[]>[this.game]); //.concat(this.components);
		console.debug("Entity#"+this.guid+" ("+(<any>this.constructor).name+") bubbling up event: "+event.name+"  to Game.");

		// Do the bubble up thing
		this.game.fireEvent(event);
		//event.propagate(targets);
	}

	receiveEvent(event: GameEvent): void {
		this.components.forEach((c: IComponent) => {
			c.receiveEvent(event);
		});
	}

	getComponent<T>(constructor: new(...args: any[]) => T): T {
		for (var i in this.components) {
			if (! this.components.hasOwnProperty(i)) continue;
			var c: any = this.components[i];
			if (c instanceof constructor) {
				return c;
			}
		}
		return null;
	}

	hasComponent(constructor:new (...args: any[]) => IComponent): boolean {
		return this.getComponent(constructor) != null;
	}

	addComponent(component:IComponent):void {
		this.components.push(component);
	}

	loadState(entityData:any):void {
		this.guid = entityData.guid;

		this.debugRawData = entityData;

		for (var i = 0; i < this.components.length; ++i) {
			var comp = this.components[i];
			comp.loadState(entityData);
		}
	}

	toString(): string {
		return "@Entity#"+this.guid;
	}

}
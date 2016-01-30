import IComponent from "./components/IComponent";
import Game from "./Game";
import IEventReceiver from "./events/IGameEventReceiver";
import GameEvent from "./events/GameEvent";

export default class Entity {

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
		this.emitEvent(event);
	}
	emitEvent(event: GameEvent): void {
		var targets = (<IEventReceiver[]>[this.game]).concat(this.components);
		console.debug("Entity emitting event: "+event.name+"  to "+targets.length+" targets.");

		event.propagate(targets);
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

}
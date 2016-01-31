
import IComponent from "../IComponent";
import Entity from "../../Entity";
import GameEvent from "../../events/GameEvent";
import IGameEventEmitter from "../../events/IGameEventEmitter";
import IGameEventReceiver from "../../events/IGameEventReceiver";

interface EventBindingDefinition {
	targetEventName: string,
	/**
	 * Additional processing that has to be performed before forwarding the arguments to the target.
	 * @param args
	 */
	argsProcessor: (args: any[]) => any[];
}

abstract class EventAdapter implements IComponent {

	private emitter: IGameEventReceiver;
	private bindings: {[sourceEventName: string]: EventBindingDefinition[]};

	// TODO: should be passed a component bag insteqd of an entity?
	constructor(emitter: IGameEventReceiver) {
		this.emitter = emitter;
		this.bindings = {};

		this.registerEvents();
	}

	abstract registerEvents(): void;

	mapEvent(source: string, target: string, argsProcessor?: (args: any[]) => any[]): void {
		// Use the argument processor, if provided
		var defaultArgProcessing = (args: any[]) => {
			return args;
		};
		if (!argsProcessor) {
			argsProcessor = defaultArgProcessing;
		}

		if (! this.bindings[source]) {
			this.bindings[source] = [];
		}
		this.bindings[source].push({
			targetEventName: target,
			argsProcessor: argsProcessor
		});
	}

	loadState(entityData: any): void {
	}

	tick(delta: number, now: number): void {
	}

	receiveEvent(event: GameEvent): void {
		console.debug("EventAdapter '"+(<any>this.constructor).name+"' of "+this.emitter.toString()+" received" +
			" event:"+ event.name);

		// Get all the events matching the event received
		var targetEvents = this.bindings[event.name];
		// If some events were found, re-route them
		if (targetEvents) {
			console.group("-> There's "+targetEvents.length+ " target events bound to event "+event.name+": ["
				+ targetEvents.map((e: EventBindingDefinition) => {return e.targetEventName;}).join(',')+"]");
			targetEvents.forEach((targetEventDefinition: EventBindingDefinition) => {
				var processedArgs = targetEventDefinition.argsProcessor(event.params);
				var newEvent = new GameEvent(targetEventDefinition.targetEventName, processedArgs, event.source);

				//this.emitter.fireEvent(newEvent);
				newEvent.propagate([this.emitter]);
			});
			console.groupEnd();
		}
	}

}

export default EventAdapter;
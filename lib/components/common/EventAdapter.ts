
import IComponent from "../IComponent";
import Entity from "../../Entity";
import GameEvent from "../../events/GameEvent";

interface EventBindingDefinition {
	targetEventName: string,
	/**
	 * Additional processing that has to be performed before forwarding the arguments to the target.
	 * @param args
	 */
	argsProcessor: (args: any[]) => any[];
}

abstract class EventAdapter implements IComponent {

	private entity: Entity;
	private bindings: {[sourceEventName: string]: EventBindingDefinition[]};

	// TODO: should be passed a component bag insteqd of an entity?
	constructor(entity: Entity) {
		this.entity = entity;
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
		console.debug("Adapter received event:", event);

		// Get all the events matching the event received
		var targetEvents = this.bindings[event.name];
		// If some events were found, re-route them
		if (targetEvents) {
			console.debug("Got "+targetEvents.length+ " target events.");
			targetEvents.forEach((targetEventDefinition: EventBindingDefinition) => {
				var processedArgs = targetEventDefinition.argsProcessor(event.params);
				var newEvent = new GameEvent(targetEventDefinition.targetEventName, processedArgs, event.source);

				this.entity.emitEvent(newEvent);
				//this.entity.emitEvent.apply(this.entity, [targetEvent.targetEventName].concat(processedArgs));
			});
		}
	}

}

export default EventAdapter;
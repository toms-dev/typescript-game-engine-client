
import IComponent from "../IComponent";
import Entity from "../../Entity";

interface EventBindingDefinition {
	targetEventName: string,
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

	receiveEvent(eventName: string, args: any[]): void {
		console.debug("Adapter received event:", eventName);

		// Get all the events matching the event received
		var targetEvents = this.bindings[eventName];
		// If some events were found, re-route them
		if (targetEvents) {
			console.debug("Got "+targetEvents.length+ " target events.");
			targetEvents.forEach((targetEvent: EventBindingDefinition) => {
				var processedArgs = targetEvent.argsProcessor(args);
				this.entity.emitEvent.apply(this.entity, [targetEvent.targetEventName].concat(processedArgs));
			});
		}
	}

}

export default EventAdapter;
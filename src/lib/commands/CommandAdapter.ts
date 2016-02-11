import IGameEventReceiver from "../events/IGameEventReceiver";
import GameEvent from "../events/GameEvent";
import Command from "./Command";
import CommandSender from "../components/common/CommandSender";

interface CommandBindingDefinition {
	targetCommandName: string;
	//targetCommandConstructor: (...args: any[]) => Command,
	/**
	 * Additional processing that has to be performed before forwarding the arguments to the target.
	 * @param args
	 */
	argsProcessor: (args: any) => any;
}

/**
 * A command adapter catches events and trigger corresponding commands.
 */
abstract class CommandAdapter implements IGameEventReceiver {

	private parent: IGameEventReceiver;
	private bindings: {[eventName: string]: CommandBindingDefinition};

	/**
	 *
	 * @param parent It will be the target of the QUEUE_COMMAND events, so it should handle this kind of event or
	 * propagate to an entity that can.
	 */
	constructor(parent: IGameEventReceiver) {
		this.parent = parent;
		this.bindings = {};

		this.setupBindings();
	}

	abstract setupBindings(): void;
	protected addBinding(sourceEventName: string, targetCommandName: string, paramsProcessor: (args: any[]) => any[] = null): void {
		// Default data processor
		if (paramsProcessor == null) {
			paramsProcessor = function(args: any) { return args;}
		}
		if (this.bindings[sourceEventName]) {
			throw new Error("There is already a command binded to this event!");
		}
		this.bindings[sourceEventName] = {
			targetCommandName: targetCommandName,
			argsProcessor: paramsProcessor
		};
	}

	receiveEvent(event: GameEvent): void {
		var commandBinding = this.bindings[event.name];
		if (! commandBinding) {
			return;
		}
		if (! event.isLocallySimulated) {
			event.stopPropagation();
		}

		//var commandConstructor = commandBinding.targetCommandConstructor;
		var commandName = commandBinding.targetCommandName;
		var paramsProcessor = commandBinding.argsProcessor;
		var processedArgs = paramsProcessor(event.params[0]);

		var command = new Command(commandName, processedArgs);
		console.log("Created command:", command);

		// Queue the command somewhere!
		var source = event.source; // TODO: or this?
		var event = new GameEvent(CommandSender.EVENT_QUEUE_COMMAND, [command], this);
		event.propagate([this.parent]);
	}

}

export default CommandAdapter;

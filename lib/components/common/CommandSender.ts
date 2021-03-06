
import Command from "../../commands/Command";
import {CommandRequest, CommandResponse} from "../../commands/Command";
import IComponent from "./../IComponent";
import GameEvent from "../../events/GameEvent";

export default class CommandSender implements IComponent {

	private sentCommands: Command[];
	private buffer: Command[];

	public static EVENT_QUEUE_COMMAND = "EVENT_QUEUE_COMMAND";

	constructor() {
		this.sentCommands = [];
		this.buffer = [];
	}

	receiveEvent(event: GameEvent): void {
		if (event.name == CommandSender.EVENT_QUEUE_COMMAND) {
			var command: Command = event.params[0];
			this.add(command);
		}
		// TODO: block event propagation
	}

	/**
	 * Queues a command to be sent on next push to server.
	 * @param c
	 */
	public add(c: Command): void {
		this.buffer.push(c);
	}

	getBufferedCommandByID(commandID: number): Command {
		for (var i = 0; i < this.buffer.length; i++) {
			var command = this.buffer[i];
			if (command.commandID == commandID) {
				return command;
			}
		}
		return null;
	}

	getSentCommandByID(commandID: number): Command {
		for (var i = 0; i < this.sentCommands.length; i++) {
			var command = this.sentCommands[i];
			if (command.commandID == commandID) {
				return command;
			}
		}
		return null;
	}
	clearSentCommand(commandID: number): void {
		var command = this.getSentCommandByID(commandID);
		if (! command) {
			throw new Error("Command #"+commandID+" not found.");
		}
		var index = this.sentCommands.indexOf(command);
		this.sentCommands.splice(index, 1);
	}

	flush(): CommandRequest[] {
		var commands = this.buffer;
		if (commands.length > 0) {
			console.log("Flushing "+commands.length + " commands to server.");
			console.debug("Flushed commands are: ", commands);
		}
		this.sentCommands = this.sentCommands.concat(this.buffer);
		this.buffer = [];
		return commands.map((c: Command) => {
			return c.getState();
		});
	}

	processCommandResponse(response: CommandResponse): void {
		var command = this.getSentCommandByID(response.commandID);
		if (!command) {
			console.warn("No command with ID "+response.commandID+" found!");
			return;
		}
		command.processResponse(response);
	}

	processCommandResponses(responses: CommandResponse[]): void {
		if (responses.length > 0){
			console.log("Received responses:", responses);
		}
		for (var i = 0; i < responses.length; i++) {
			var response = responses[i];
			this.processCommandResponse(response);
		}
	}

	loadState(entityData: any): void {
	}

	tick(delta: number): void {
	}

}

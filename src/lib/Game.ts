import World from "./World";
import Renderer from "./rendering/Renderer";
import Keyboard from "./input/Keyboard";
import GameClient from "./network/GameClient";
import Mouse from "./input/Mouse";
import Camera from "./rendering/Camera";
import Entity from "./Entity";
import PlayerControl from "./components/common/PlayerControl";
import CommandSender from "./components/common/CommandSender";
import ServerState from "./network/ServerState";
import ComponentBag from "./components/ComponentBag";
import NamedEntityTypeResolver from "./entityTyping/NamedEntityTypeResolver";
import DecorationContext from "./decorators/DecorationContext";
import EntityTypeResolver from "./entityTyping/EntityTypeResolver";
import Class from "./utils/Class";
import {Named as NamedEntityTyping} from "./entityTyping/EntityTypings";
import EntityTypingClass from "./decorators/EntityTypingClass";

import IComponent from "./components/IComponent";
import UIComponent from "./components/UIComponent";

import IGameEventReceiver from "./events/IGameEventReceiver";
import GameEvent from "./events/GameEvent";
import CommandAdapter from "./commands/CommandAdapter";
import IGameEventEmitter from "./events/IGameEventEmitter";

import {Entity as SharedEntity, DecorationContext as SharedDecorationContext} from "typescript-game-engine-server";

declare var window: any;
declare var $: any;

export default class Game extends ComponentBag implements IGameEventReceiver, IGameEventEmitter {
	private client: GameClient;

	public rootEntity: SharedEntity;
	public world: World;

	public context: DecorationContext;
	public sharedContext: SharedDecorationContext;

	// Rendering
	private renderer: Renderer;
	private lastUpdate: number;

	private keyboard: Keyboard;
	private mouse: Mouse;
	private doStop: boolean;

	private controlledEntity: Entity;

	public commandSender: CommandSender;
	public commandAdapters: CommandAdapter[];

	// UI
	//
	private uiElements: any[];

	public fakeLocalLag = 0;

	constructor() {
		super();
		var host = window.location.hostname;
		this.client = new GameClient(this, host, 8080);

		this.world = new World();



		this.keyboard = new Keyboard();
		this.mouse = new Mouse(this.world);


		// Manage UI
		//
		this.commandSender = new CommandSender();
		this.commandAdapters = [];

		this.uiElements = [];

		// Make it global
		window.game = this;

		this.controlledEntity = null;
	}

	loadContext(context: DecorationContext): void {
		this.context = context;

		var resolvers = this.buildTypeResolvers(context);
		this.world.loadEntityTypeResolvers(resolvers);
	}

	/**
	 * Uses the context (containing metadata provided by decorators) to configure the resolvers for all the declared
	 * entities.
	 * @param context
	 * @returns {{}}
	 */
	private buildTypeResolvers(context: DecorationContext): {[metaTypeName: string]: EntityTypeResolver} {
		// Manage Entity Type resolvers
		var resolvers: {[metaTypeName: string]: EntityTypeResolver} = {};

		// Instantiate the different kind of resolvers
		// TODO: Instantiate resolvers from declaration in decorators?
		var namedResolver = new NamedEntityTypeResolver(this);

		var entityClasses = context.getDeclaredClasses("entity");
		for (var i = 0; i < entityClasses.length; ++i) {
			var entityClass: Class<Entity> = entityClasses[i];
			// Retrieve typing data
			var typing: EntityTypingClass = Reflect.getMetadata('typing', entityClass);
			// Process it the right way
			if (typing instanceof NamedEntityTyping) {
				namedResolver.defineType(typing.typeName, entityClass);
				// TODO: each resolver could try to accept() an EntityTypingClass instance and do the configuration
				// itself (if relevant)
			}
			else {
				throw new Error("Don't know how to process typing '"+(<any>typing.constructor).name+"'");
			}
			console.debug("GOT TYPING FROM CLASS "+(<any>entityClass).name, typing);
		}

		// Store the resolver in the result
		resolvers["namedType"] = namedResolver;

		return resolvers;
	}

	start() {
		// TODO: loader waiting for WS
		this.client.connect(() => {
			// TODO: hide loader
			this.startLoop();
		});

	}

	stop(): void {
		this.stopLoop();
		this.client.disconnect();
	}

	onGameJoin() {
		// TODO: renderer refactoring: make it a plugable component
		/*// Setup renderer
		var $canvas = $("#gameView");
		var canvas = $canvas.get(0);
		this.renderer = new Renderer($canvas, this.world);

		// Setup inputs

		this.keyboard.setup();

		this.mouse.setup(canvas, this.renderer.getCamera());*/

		this.startLoop();
	}

	public onDisconnected() {
		//$("#disconnectedView").fadeIn();	// TODO: move this in a UI-dedicated component
		this.stopLoop();
	}

	public startLoop(): void {
		console.log("Started render loop");
		this.doStop = false;
		this.lastUpdate = new Date().getTime();
		this.mainLoop();
	}

	mainLoop() {
		if (this.doStop) {
			console.log("Loop stopped");
			return;
		}

		var now = new Date().getTime();
		var delta = now - this.lastUpdate; //10;	// FIXME: calculate for real
		this.lastUpdate = now;

		this.world.tick(delta, now);

		// Iterate over UI elements and tick each of them
		for (var iUIElement = 0; iUIElement < this.uiElements.length; iUIElement++) {
			var uiElement = this.uiElements[iUIElement];
			uiElement.tick(delta, now);
		}

		var inputState = {
			keys: this.keyboard.getState(),
			action: this.mouse.getState(),
			commands: this.commandSender.flush()
		};

		if (inputState.action.type) {
			console.log("Input state:", inputState.action);
		}

		//console.log("ship:", inputState.commands.ship);

		this.client.sendInputState(inputState);
		this.mouse.clearState();

		this.tick(delta, now);
		//this.renderer.render();

		requestAnimationFrame(() => {
			this.mainLoop();
			/*setTimeout(() => {
				this.mainLoop();
			}, this.fakeLocalLag);*/
		});
	}

	public addComponent(component: IComponent): void {
		super.addComponent(component);
		if (component instanceof UIComponent) {
			component.setup();
		}
	}

	processServerState(data: ServerState):void {
		window.lastServerState = data.world;
		var log = false;
		if (log) console.group("Processing server state");
		this.rootEntity.fromState(data.world, this.sharedContext);
		if (log) console.groupEnd();

		//throw "the end!";
		/*window.debugStop = window.debugStop ? window.debugStop + 1 : 1;
		if (window.debugStop == 2) throw new Error("debug end");*/

		//this.world.processServerState(data.world);
		this.commandSender.processCommandResponses(data.commandResponses);
		//console.log("Got server state:", data);
	}

	processPingValue(ping:number):void {
		//$("#pingValue").text(ping);
	}

	stopLoop():void {
		this.doStop = true;
	}

	getEventTargets(): IGameEventReceiver[] {
		return []
			.concat(this.commandAdapters)
			.concat(this.commandSender)
			.concat(this.components)
			.concat(this.world.getEntities())
			;
	}

	/**
	 *
	 * @param event An event that's already propagating.
	 */
	receiveEvent(event: GameEvent): void {
		var targets = this.getEventTargets();

		event.addPropagationTargets(targets);
	}

	/**
	 * Ignites the event propagation
	 * @param event
	 */
	fireEvent(event: GameEvent): void {
		var targets = this.getEventTargets();

		event.propagate(targets);
	}

	toString(): string {
		return "@Game";
	}

}
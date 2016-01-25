import Game from "./lib/Game";
import Entity from "./lib/Entity";
import EntityTyping from "./lib/entityTyping/EntityTypings";
import IComponent from "./lib/components/IComponent";
import UIComponent from "./lib/components/UIComponent";
import MovementComponent from "./lib/components/common/Movement";
import Command from "./lib/commands/Command";
import CommandSender from "./lib/components/common/CommandSender";

import * as Declare from "./lib/decorators/index";
import Loader from "./lib/decorators/Loader";

// Hack to load typings when used in a lib ;) (as references are not allowed in index file)
import Definitions from "./lib/_definitions";
Definitions;

export {
	// Decorators
	Declare, Loader,
	// Core classes
	Game, Entity,
	// Components
	IComponent, UIComponent, MovementComponent,
	// Commands
	Command, CommandSender,

	// Typings
	EntityTyping,
};

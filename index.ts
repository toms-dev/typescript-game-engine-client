
// <reference path="typings/tsd.d.ts" />

import Game from "./lib/Game";
import Entity from "./lib/Entity";
import IComponent from "./lib/components/IComponent";
import UIComponent from "./lib/components/UIComponent";
import MovementComponent from "./lib/components/common/Movement";
import Command from "./lib/commands/Command";
import CommandSender from "./lib/components/common/CommandSender";

export {
	Game, Entity,
	// Components
	IComponent, UIComponent, MovementComponent,
	// Commands
	Command, CommandSender
};
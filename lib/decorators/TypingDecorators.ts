import Entity from "../Entity";
import Class from "../utils/Class";
import DecorationContext from "./DecorationContext";

import EntityTypingClass from "./EntityTypingClass";
import {DecorationContext as SharedDecorationContext} from "typescript-game-engine-server";

require('reflect-metadata');

export function Entity(clazz: Class<Entity>): void {
	DecorationContext.instance.registerClass("entity", clazz);
}

export function EntityTyping(entityType: EntityTypingClass): (clazz: Class<Entity>) => void {
	return function(clazz: Class<Entity>): void {
		// Store the class in the typing, just in case
		entityType.setClass(clazz);

		// Store the typing in the class metadata
		if (! Reflect.hasMetadata("typing", clazz)) {
			Reflect.defineMetadata("typing", entityType, clazz);
			console.log("Defined typing for '"+(<any>clazz).name+"':", Reflect.getMetadata("typing", clazz));
		}
		else {
			throw new Error("Entity typing for "+(<any>clazz).name+" is already defined.");
		}
	}
}

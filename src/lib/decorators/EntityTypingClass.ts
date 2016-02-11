import Class from "../utils/Class";
import Entity from "../Entity";

export default class EntityTypingClass {

	public clazz: Class<Entity>;

	constructor() {
		this.clazz = null;
	}

	setClass(clazz: Class<Entity>): void {
		this.clazz = clazz;
	}
}
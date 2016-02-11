
import Class from "../utils/Class";

export default class DecorationContext {
	private static isStarted: boolean = false;
	static instance: DecorationContext = null;

	public classesDeclarations: {[type: string]: Class<any>[]};
	/*public entitiesClasses: (new (...args:any[]) => Entity)[];
	public componentsClasses: (new (...args:any[]) => IComponent)[];
	public mapsClasses: (new (...args:any[]) => Map)[];
	public startMapClass: new (...args:any[]) => Map;*/

	constructor() {
		this.classesDeclarations = {};
	}

	public static start(): void {
		if (this.isStarted) {	// make the loader fool-proof
			throw new Error("DecorationContext already started.");
		}
		this.instance = new DecorationContext();
		this.isStarted = true;
	}

	public registerClass(classGroup: string, clazz: Class<any>): void {
		if (! this.classesDeclarations[classGroup]) {
			this.classesDeclarations[classGroup] = [];
		}
		this.classesDeclarations[classGroup].push(clazz);
	}

	public getDeclaredClasses(classGroup: string): Class<any>[] {
		var classes = this.classesDeclarations[classGroup];
		if (! classes) {
			throw new Error("No class found in class group '"+classGroup+"'.");
		}
		return classes;
	}

	/**
	 * Stores the results of the class loading and reset the context for another use.
	 * @returns {DecorationContext}
	 */
	public static build(): DecorationContext {
		DecorationContext.instance.finalize();
		this.isStarted = false;
		return DecorationContext.instance;
	}

	public finalize(): void {
		// TODO: this method is ought to be overriden to perform additional processing.
	}
}

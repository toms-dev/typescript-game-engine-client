
import Entity from "./../Entity";
import Class from "./../utils/Class";
import EntityTypeResolver from "./EntityTypeResolver";

export default class NamedEntityTypeResolver implements EntityTypeResolver {

	private types: {[typeName: string] : Class<Entity>};

	constructor() {
		this.types = {};
	}

	defineType(name: string, clazz: Class<Entity>): void {
		if (this.types[name]) {
			throw new Error("Type '"+name+"' is already defined!");
		}
		this.types[name] = clazz;
	}

	resolve(typeData: any): Entity {
		var name = typeData.name;
		if (! name) {
			throw new Error("Invalid type data content. Needed 'name' but found: "+Object.keys(typeData).join(','));
		}
		if (! this.types[name]) {
			throw new Error("NamedType resolution failed: Type '"+name+"' is not defined in the resolver \n(defined" +
				" types are: "+Object.keys(this.types).join(',')+").");
		}
		return new (this.types[name])();
	}
}

import Entity from "../Entity";
import Class from "../utils/Class";
import EntityTypingClass from "../decorators/EntityTypingClass";

class NamedEntityType extends EntityTypingClass {

	public typeName: string;

	constructor(typeName: string) {
		super();
		this.typeName = typeName;
	}

}

class TraitEntityTyping extends EntityTypingClass {

}

var EntityTypings = {
	Named: NamedEntityType
};

export {
	NamedEntityType as Named,
	TraitEntityTyping as Trait
}
export default EntityTypings;

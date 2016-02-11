import Entity from "../Entity";

interface EntityTypeResolver {

	resolve(typeData: any): Entity;

}

export default EntityTypeResolver;
import Entity from "./Entity";
//import EntityType from "./EntityType";
import Vector3 from "./math/Vector3";
import Movement from "./components/common/Movement";
import EntityTypeResolver from "./entityTyping/EntityTypeResolver";

export default class World {

	private entities: Entity[];
	private entityTypeResolvers: {[metaTypeName: string]: EntityTypeResolver};

	constructor() {
		this.entities = [];
		this.entityTypeResolvers = null;
	}

	loadEntityTypeResolvers(resolvers: {[metaTypeName: string]: EntityTypeResolver}): void {
		this.entityTypeResolvers = resolvers;
	}

	getEntity(id: number): Entity {
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			if (e.guid == id) return e;
		}
		return null;
	}

	getEntities(): Entity[] {
		return this.entities;
	}

	processServerState(worldData: any): void {
		var entities = worldData.entities;

		for (var i = 0; i < entities.length; ++i) {
			var entityData = entities[i];
			var entity = this.getEntity(entityData.guid);
			if (entity == null) {
				this.spawnEntity(entityData);
			} else {
				entity.loadState(entityData);
			}
		}

		var entitiesToDespawn = worldData.entitiesToDespawn;
		for (var i = 0; i < entitiesToDespawn.length; ++i) {
			var entityID = entitiesToDespawn[i];
			this.removeEntityByID(entityID);
		}
	}

	public tick(delta: number, now: number): void {
		for (var i = 0; i < this.entities.length; i++) {
			var entity = this.entities[i];
			entity.tick(delta, now);
		}
	}

	private spawnEntity(entityData: any): Entity {
		console.log("Spawning from data:", entityData);

		var entityType = entityData.type;

		// TODO: [META] Find the class to instantiate from their declaration via decorators
		console.debug("Entity type data", entityType);
		console.debug("Defined resolvers:", this.entityTypeResolvers);
		var typeResolver = this.entityTypeResolvers[entityType.metaType];
		if (!typeResolver) {
			throw new Error("Unsupported entity meta-type: " + entityType.metaType);
		}
		console.debug("Resolver: ", typeResolver);
		var entity = typeResolver.resolve(entityType.typeData);

		/*var typeMapping:any = {};

		 typeMapping[EntityType.BOARDS] = Boards;
		 typeMapping[EntityType.BULLET] = Bullet;
		 typeMapping[EntityType.SHIP] = Ship;

		 var EntityClass:new () => Entity = typeMapping[entityType];


		 var e = new EntityClass();*/

		entity.loadState(entityData);
		this.entities.push(entity);
		console.log("Spawned entity:", entity);
		return entity;
	}

	getClosestEntityNear(coords: Vector3, additionalFilter?: (ent: Entity) => boolean) {
		var bestDist = Infinity,
			bestEntity: Entity = null;
		/*console.log("Nearest: ", coords);
		 console.log("Entities:", this.entities);*/
		this.entities.forEach((entity: Entity) => {
			if (additionalFilter) {
				if (!additionalFilter(entity)) return;
			}
			console.log("Filter match:", entity);
			var movement: Movement = entity.getComponent(Movement);
			var dist = movement.getPosition().to(coords).norm();
			if (dist < bestDist) {
				bestDist = dist;
				bestEntity = entity;
				//console.log("New best:", bestEntity.guid, '@', bestDist);
			}
		});
		return {
			entity: bestEntity,
			distance: bestDist
		};
	}

	/**
	 * Returns all the entities at a given position in the world. The list is sorted by ascending distance to coords.
	 * @param coords
	 * @returns {Entity[]}
	 */
	getEntitiesAt(coords: Vector3): Entity[] {
		console.log("Searching through " + this.entities.length + " entities");

		return this.entities.map((entity: Entity) => {
				console.log("Considering:", entity);
				var movement: Movement = entity.getComponent(Movement);
				if (!movement) {
					console.log("NO MOVEMENT!");
					return false;
				}

				var dist = movement.getPosition().to(coords).norm();
				console.log("DISTANCE: " + dist);

				return {
					dist: dist,
					entity: entity
				};
			})
			.filter((data: EntityAtDistance) => {
				var movement: Movement = data.entity.getComponent(Movement);
				return data.dist <= movement.getRadius();
			})
			.sort((data1: EntityAtDistance, data2: EntityAtDistance) => {
				return data1.dist - data2.dist;
			})
			.map((data: EntityAtDistance) => {
				return data.entity
			});
	}

	private removeEntityByID(entityID: number): void {
		var ent = this.getEntity(entityID);
		var index = this.entities.indexOf(ent);
		if (index != -1) {
			this.entities.splice(index, 1);
		}
	}
}

interface EntityAtDistance {
	dist: number,
	entity: Entity
}
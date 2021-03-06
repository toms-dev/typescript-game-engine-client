
import Config from "../../Config";

import IComponent from "./../IComponent";
import Vector3 from "../../math/Vector3";
import Vector3LERP from "../../math/Vector3LERP";

import Entity from "../../Entity";
import GameEvent from "../../events/GameEvent";

export default class Movement implements IComponent {

	private entity: Entity;

	private position: Vector3;
	public radius: number;
	private speed: Vector3;
	private maxSpeed: number;
	private acceleration: Vector3;

	private positionLERP: Vector3LERP;

	private firstLoad: boolean;

	constructor(entity: Entity) {
		this.entity = entity;
		this.position = new Vector3();
		this.speed = new Vector3();
		this.radius = 10;

		this.firstLoad = true;
		this.positionLERP = null;
	}

	loadState(entityData:any):void {
		if (this.firstLoad) {
			this.firstLoad = false;
			this.position.copyFrom(entityData.position);
		}
		else {
			var targetPosition = Vector3.fromJSON(entityData.position);
			if (! this.position.equals(targetPosition, 0.01)) {
				//console.error("TARGET:", targetPosition);
				this.positionLERP = new Vector3LERP(this.position, targetPosition, Config.lerp);
			}
		}
	}

	receiveEvent(event: GameEvent): void {
	}

	tick(delta:number, now: number):void {
		var deltaS = delta/1000;

		// TODO: apply acceleration

		// Update the position to follow the speed
		var deltaPosition = this.speed.multiplyScalar(deltaS);
		var newPosition = this.position.add(deltaPosition);
		this.position.copyFrom(newPosition);

		// LERP overrides position
		if (this.positionLERP) {
			this.positionLERP.tick(delta, now);
			this.position.copyFrom(this.positionLERP.getValue());

			if (this.positionLERP.isFinished()) {	// clear the lerp
				this.positionLERP = null;
			}
		}
	}

	setSpeed(v: Vector3): void {
		this.speed.copyFrom(v);
	}

	getPosition():Vector3{
		return this.position;
	}

}

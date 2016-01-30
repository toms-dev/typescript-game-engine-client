import IEventReceiver from "./../events/IGameEventReceiver";

interface IComponent extends IEventReceiver {

	loadState(entityData: any): void;

	tick(delta: number, now: number): void;

}


export default IComponent;


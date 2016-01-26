
interface IComponent {

	loadState(entityData: any): void;

	tick(delta: number, now: number): void;

	receiveEvent(eventName: string, args: any[]): void;

}


export default IComponent;


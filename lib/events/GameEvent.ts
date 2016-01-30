
import IGameEventReceiver from "./IGameEventReceiver";
export default class GameEvent {

	public name: string;
	public params: any[];
	public source: any;

	public propagationStopped: boolean;
	private activeTargets: IGameEventReceiver[];
	private pendingTargets: IGameEventReceiver[];

	private isActive: boolean;

	constructor(name: string, params: any[], source: any) {
		this.name = name;
		this.params = params;
		this.source = source;

		this.isActive = false;
		this.propagationStopped = false;
		this.pendingTargets = [];
	}

	propagate(targets: IGameEventReceiver[]): void {
		if (this.isActive) {
			throw new Error("GameEvent '"+this.name+"' is already active!")
		}
		this.isActive = true;
		this.activeTargets = targets;
		for (var i = 0; i < this.activeTargets.length; ++i) {
			var target = this.activeTargets[i];
			console.log("Target["+i+"] = ", target);
			target.receiveEvent(this);

			// If the propagation is stopped, store the remaining targets that have to be notified if the propagation is
			// resumed.
			if (this.propagationStopped) {
				this.pendingTargets = targets.slice(i, targets.length);
				break;
			}
		}
		this.isActive = false;
	}

	addPropagationTargets(targets: IGameEventReceiver[]): void {
		if (!this.isActive) {
			throw new Error("Dynamically adding propagation target to inactive event!");
		}
		this.activeTargets = this.activeTargets.concat(targets);
	}

	stopPropagation(): void {
		this.propagationStopped = true;
	}
	resumePropagation(): void {
		this.propagationStopped = false;
		this.propagate(this.pendingTargets);
	}
}
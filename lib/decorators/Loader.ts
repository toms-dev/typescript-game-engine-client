import DecorationContext from "./DecorationContext";

export default class Loader {

	static loadProject(path: string): DecorationContext {
		DecorationContext.start();
		require(path);
		return DecorationContext.build();
	}

	static listen(): void {
		DecorationContext.start();
	}

	static done(): DecorationContext {
		return DecorationContext.build();
	}
}

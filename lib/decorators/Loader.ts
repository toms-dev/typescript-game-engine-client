import path = require("path");
import DecorationContext from "./DecorationContext";

declare var require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

export default class Loader {

	static loadProject(path: string): DecorationContext {
		DecorationContext.start();
		require(["./"+path], function() {
			console.log("RESOLVED!");
			throw "the end!";
		});
		//System.import(path);
		return DecorationContext.build();
	}

	static listen(): void {
		DecorationContext.start();
	}

	static done(): DecorationContext {
		return DecorationContext.build();
	}

	/*static test(classes: string[], dirname: string): void {
		classes.forEach((classPath: string) => {
			var fullpath = path.join(dirname, classPath);
			console.log("LOADING " + fullpath);
			//require(fullpath);
			console.debug("LOADED!");
		});
	}

	static test2(home: string): void {
		//require("../../../../js/game/BoxEntity");
		console.log("V2");
		//var lePath = "/game/BoxEntity";
		require.ensure([home+"../../../../js/game/BoxEntity"], (require) => {
			var derp = require("${../../../../js/game/BoxEntity}");
			console.log("Derp:", derp);
		});
		//require.ensure(["../../../../js/game/BoxEntity"], () => {
		//});
	}*/
}

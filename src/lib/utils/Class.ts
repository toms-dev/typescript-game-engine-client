
interface Class<T> {
	//[typeName: string] : new (...args: any[]) => T;
	new (...args: any[]): T;
}

export default Class;
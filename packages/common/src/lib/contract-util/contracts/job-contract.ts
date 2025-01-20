export class Void {};

interface Manifest<Payload> {
	queue: string;
	name: string;
	payload: new () => Payload;
}

export class JobContract<Payload> {
	constructor(
		public readonly manifest: Manifest<Payload>
	){
		Object.freeze(this);
	}
}
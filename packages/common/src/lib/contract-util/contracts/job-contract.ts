export class Void {};

interface Manifest<TPayload> {
	queue: string;
	name: string;
	payload: new () => TPayload;
}

export class JobContract<TPayload> {
	constructor(
		public readonly manifest: Manifest<TPayload>
	){
		Object.freeze(this);
	}
}
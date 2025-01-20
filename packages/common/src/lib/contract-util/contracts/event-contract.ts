interface Manifest<TPayload> {
	topic: string;
	type: string;
	payload: new() => TPayload;
}

export class EventContract<TPayload> {
	constructor(
		public readonly manifest: Manifest<TPayload>
	){
		Object.freeze(this);
	}
}
interface Manifest<Payload> {
	topic: string;
	type: string;
	payload: new() => Payload;
}

export class EventContract<Payload> {
	constructor(
		public readonly manifest: Manifest<Payload>
	){
		Object.freeze(this);
	}
}
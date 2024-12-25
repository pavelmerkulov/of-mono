interface Manifest<Payload> {
	topic: string;
	type: string;
	payload?: Payload
}

export class EventContract<Payload> {
	constructor(
		public readonly manifest: Manifest<Payload>
	){
		Object.freeze(this);
	}
}
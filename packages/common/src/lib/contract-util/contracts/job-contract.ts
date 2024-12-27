interface Manifest<Payload> {
	queue: string;
	name: string;
	payload?: Payload;
}

export class JobContract<Payload> {
	constructor(
		public readonly manifest: Manifest<Payload>
	){
		Object.freeze(this);
	}
}
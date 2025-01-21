export class BaseError<TInfo = any> extends Error {
	public info?: TInfo;
	public statusCode?: number;

	constructor(message?: string, info?: TInfo) {
		super(message);
		this.info = info;
		if (!this.message) {
			this.message = this.constructor.name;
		}
	}
}

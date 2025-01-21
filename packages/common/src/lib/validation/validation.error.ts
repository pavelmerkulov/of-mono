import { BaseError } from '../base.error';

// @todo we need to add types for TInfo
export class ValidationError extends BaseError<any> {
	constructor(message?: string, info?: any) {
		super(message, info);
		this.statusCode = 422;
	}
}

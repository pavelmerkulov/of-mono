import { EventContract } from "../../../lib/contract-util/contracts/event-contract";
import Joi from 'joi'

export class Payload {
	id: string = ''; 
	getSchemaValidation?: () => Joi.ObjectSchema;
	
	constructor() {
		this.getSchemaValidation = () => {	
			return Joi.object({
				id: Joi.string(),
			});
		}
	}
}

export const ConnectionCreatedEC = new EventContract({
	topic: 'connection',
    type: 'ConnectionCreated',
    payload: new Payload()
});
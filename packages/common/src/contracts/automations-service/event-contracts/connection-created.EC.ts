import { EventContract } from "../../../lib/contract-util/contracts/event-contract";
import Joi from 'joi'

export class Payload {
	id: string = ''; 
}

export const ConnectionCreatedEC = new EventContract({
	topic: 'connection',
    type: 'ConnectionCreated',
    payload: new Payload(),
	payloadSchema: {	
		return Joi.object({
			id: Joi.string(),
		});
	}
});
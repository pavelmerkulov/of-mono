import Joi from 'joi'
import { JobContract } from "../../../lib/contract-util/contracts/job-contract";

export class Payload {
	id: string = ''; 
	email: string = '';
	getSchemaValidation?: () => Joi.ObjectSchema;
	
	constructor() {
		this.getSchemaValidation = () => {	
			return Joi.object({
				id: Joi.string(),
				email: Joi.string(),
			});
		}
	}
}

export const SendNotifEmailsJC = new JobContract({
	queue: 'email-queue',
	name: 'send-notif-emails',
    payload: new Payload()
});
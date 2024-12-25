import { RequestContract } from "../../../lib/contract-util/contracts/request-contract";
import Joi from 'joi'

export class RequestPayload {
	sourceApp: 'pipedrive' | 'google' = 'pipedrive'; 
	destinationApp: 'mailchimp' | 'activecamp' = 'mailchimp';
}

export class ResponsePayload {
	id: string = ''; 
}

export const CreateConnectionRC = new RequestContract({
	url: '/connections',
	method: 'POST',
	hostAlias: 'AUTOMATIONS_SERVICE',
	
	requestPayload: new RequestPayload(),
	requestPayloadSchema: Joi.object({
		sourceApp: Joi.valid('pipedrive', 'google'),
		destinationApp: Joi.valid('mailchimp', 'activecamp'),
	}),
	
	responsePayload: new ResponsePayload(),
	responsePayloadSchema: Joi.object({
		id: Joi.string(),
	})
});
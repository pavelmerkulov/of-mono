import { RequestContract } from "../../../lib/contract-util/contracts/request-contract";
import Joi from 'joi'

export class RequestPayload {
	connectionId: string = '';
    sourceApp: 'pipedrive' | 'google' = 'pipedrive'; 
	destinationApp: 'mailchimp' | 'activecamp' = 'mailchimp';
}


export const UpdateConnectionRC = new RequestContract({
	url: '/connections/:connectionId',
	method: 'PUT',
    hostAlias: 'AUTOMATIONS_SERVICE',
	
    requestPayload: new RequestPayload(),
    requestPayloadSchema: Joi.object({
        connectionId: Joi.string(),
        sourceApp: Joi.valid('pipedrive', 'google'),
        destinationApp: Joi.valid('mailchimp', 'activecamp'),
    })
});
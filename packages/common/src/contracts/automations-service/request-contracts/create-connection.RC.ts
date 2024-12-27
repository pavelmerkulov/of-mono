import { RequestContract } from "../../../lib/contract-util/contracts/request-contract";
import { IsEnum, IsString } from "class-validator";
import { IntegrationApp } from "../../../types/intergration-app";

export class RequestPayload {
	@IsEnum(IntegrationApp)
	sourceApp: IntegrationApp = IntegrationApp.unknown; 
	
	@IsEnum(IntegrationApp)
	destinationApp: IntegrationApp = IntegrationApp.unknown; ;
}

export class ResponsePayload {
	@IsString()
	id: string = ''; 
}

export const CreateConnectionRC = new RequestContract({
	url: '/connections',
	method: 'POST',
	hostAlias: 'AUTOMATIONS_SERVICE',
	requestPayload: new RequestPayload(),
	responsePayload: new ResponsePayload(),
});
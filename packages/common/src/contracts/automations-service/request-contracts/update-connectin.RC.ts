import { RequestContract } from "../../../lib/contract-util/contracts/request-contract";
import { IsEnum, IsString } from "class-validator";
import { IntegrationApp } from "../../../types/intergration-app";

export class RequestPayload {
	@IsString()
    connectionId: string = '';
    
    @IsEnum(IntegrationApp)
    sourceApp: IntegrationApp = IntegrationApp.unknown; 
    
    @IsEnum(IntegrationApp)
    destinationApp: IntegrationApp = IntegrationApp.unknown; ;
}


export const UpdateConnectionRC = new RequestContract({
	url: '/connections/:connectionId',
	method: 'PUT',
    hostAlias: 'AUTOMATIONS_SERVICE',
    requestPayload: new RequestPayload(),
});
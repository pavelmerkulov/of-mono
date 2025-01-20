import { EventContract } from "../../../lib/contract-util/contracts/event-contract";
import { IsEnum, IsString } from "class-validator";
import { IntegrationApp } from "../../../types/intergration-app";

export class Payload {
	@IsString()
	id: string = '';
	
	createdAt!: Date;

	@IsEnum(IntegrationApp)
	sourceApp: IntegrationApp = IntegrationApp.unknown; 
	
	@IsEnum(IntegrationApp)
	destinationApp: IntegrationApp = IntegrationApp.unknown; ;
}

export const ConnectionCreatedEC = new EventContract({
	topic: 'connection',
    type: 'ConnectionCreated',
    payload: Payload
});
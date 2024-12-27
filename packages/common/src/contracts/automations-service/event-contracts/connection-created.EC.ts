import { EventContract } from "../../../lib/contract-util/contracts/event-contract";
import { IsString } from "class-validator";

export class Payload {
	@IsString()
	id: string = ''; 
}

export const ConnectionCreatedEC = new EventContract({
	topic: 'connection',
    type: 'ConnectionCreated',
    payload: new Payload(),
});
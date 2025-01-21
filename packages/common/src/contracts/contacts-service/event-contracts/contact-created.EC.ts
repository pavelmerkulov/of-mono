import { EventContract } from "../../../lib/contract-util/contracts/event-contract";
import { IsDefined, IsEmail } from "class-validator";

export class Payload {
	@IsDefined()
	@IsEmail()
	email!: string;
}

export const ContactCreatedEC = new EventContract({
	topic: 'contact',
	type: 'ContactCreated',
	payload: Payload
});
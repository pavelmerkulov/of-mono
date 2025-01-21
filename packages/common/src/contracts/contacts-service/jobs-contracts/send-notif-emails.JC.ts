import { JobContract } from "../../../lib/contract-util/contracts/job-contract";
import { IsDefined, IsEmail } from "class-validator";

export class Payload {
	@IsDefined()
	@IsEmail()
	email: string = '';
}

export const SendNotifEmailsJC = new JobContract({
	queue: 'email-queue',
	name: 'send-notif-emails',
    payload: Payload,
});
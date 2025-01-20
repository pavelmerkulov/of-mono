import { JobContract, Void } from "../../../lib/contract-util/contracts/job-contract";
import { IsEmail, IsString } from "class-validator";

export class Payload {
	@IsString()
	id: string = ''; 
	
	@IsEmail()
	email: string = '';
}

export const SendNotifEmailsJC = new JobContract({
	queue: 'email-queue',
	name: 'send-notif-emails',
    payload: Payload,
});
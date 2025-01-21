import { RequestContract } from "../../../lib/contract-util/contracts/request-contract";
import { IsDefined, IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { EmptyClass } from "../../../lib/contract-util/contracts/empty-class";

export class RequestPayload {
	@IsDefined()
	@IsNotEmpty()
	connectionId!: string;
	
	@IsDefined()
	@IsEmail()
	email!: string;
	
	@IsDefined()
	@IsNotEmpty()
	firstName!: string; 
	
	@IsDefined()
	@IsNotEmpty()
	lastName!: string;
}

export class ResponsePayload {
	@IsDefined()
	@IsNotEmpty()
	id: string = ''; 
}

export const CreateContactRC = new RequestContract({
	name: 'CreateContactRC',
	url: '/contacts',
	method: 'POST',
	hostAlias: 'CONTACTS_SERVICE',
	requestPayload: RequestPayload,
	responsePayload: ResponsePayload,
	urlParams: EmptyClass
});
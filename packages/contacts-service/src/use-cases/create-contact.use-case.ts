import { RequestPayload, ResponsePayload } from "@of-mono/common/contracts/contacts-service/request-contracts/create-contact.RC";
import { Broker } from "@of-mono/common/lib/contract-util/broker";
import { Service } from 'typedi';
import { ContactsRepository } from "../repositories/contacts-repository";
import { Contact } from "../models/Contact";
import { ContactCreatedEC } from "@of-mono/common/contracts/contacts-service/event-contracts/contact-created.EC";
import { logger } from '@of-mono/common/lib/logger';

@Service({ transient: true })
export class CreateContactUseCase {

    constructor(
        private broker: Broker, 
        private contactsRepository: ContactsRepository
    ) {}

    public async execute(data: RequestPayload): Promise<ResponsePayload> {
        const contact = new Contact();
		contact.connectionId = data.connectionId;
		contact.email = data.email;
		contact.firstName = data.firstName;
		contact.lastName = data.lastName;
        await this.contactsRepository.saveContact(contact);


        this.broker.sendEvent(ContactCreatedEC, contact);
		logger.info({
			message: 'THROW EVENT CONTACT CREATED',
			payload: data
		})

        return {
            id: contact.id
        }
    }
}
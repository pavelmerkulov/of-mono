import { Contact } from "../models/Contact";
import { Service } from 'typedi';

@Service()
export class ContactsRepository {
	async saveContact(contact: Contact): Promise<Contact> {
		contact.id = '222';
		return contact;
	}
}
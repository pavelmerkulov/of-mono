import { Controller } from '@of-mono/common/lib/contract-util/decorators/controller';
import { Event } from '@of-mono/common/lib/contract-util/decorators/event';
import { ContactCreatedEC, Payload as ContactCreatedECPayload } from "@of-mono/common/contracts/contacts-service/event-contracts/contact-created.EC";
import { logger } from '@of-mono/common/lib/logger';
import { Container as DiContainer } from 'typedi';
import { Broker } from '@of-mono/common/lib/contract-util/broker';
import { SendNotifEmailsJC } from '@of-mono/common/contracts/contacts-service/jobs-contracts/send-notif-emails.JC';

@Controller
export class ContactEventController {
	@Event(ContactCreatedEC, { groupId: 'kafka-group-1', concurrency: 10 })
	async handleContactCreated(payload: ContactCreatedECPayload) {
		logger.info({
			message: "GOT EVENT CONTACT CREATED",
			payload
		})

		const broker = DiContainer.get(Broker);

		logger.info({
			message: "ADD JOB SEND EMAIL",
			payload
		})
		broker.addJob(SendNotifEmailsJC, {
			email: payload.email
		})
	}
}
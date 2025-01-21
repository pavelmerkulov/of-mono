import { Controller } from '@of-mono/common/src/lib/contract-util/decorators/controller';
import { Event } from '@of-mono/common/src/lib/contract-util/decorators/event';
import { ContactCreatedEC, Payload as ContactCreatedECPayload } from "@of-mono/common/src/contracts/contacts-service/event-contracts/contact-created.EC";
import { logger } from '@of-mono/common/src/lib/logger';

@Controller
export class ContactEventController {
	@Event(ContactCreatedEC, { groupId: 'kafka-group-2', concurrency: 10 })
	async handleContactCreated(payload: ContactCreatedECPayload) {
		logger.info({
			message: "GOT EVENT CONTACT CREATED",
			payload
		})
	}
}
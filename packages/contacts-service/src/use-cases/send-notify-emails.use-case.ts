import { Broker } from "@of-mono/common/lib/contract-util/broker";
import { Service } from 'typedi';
import { Payload as SendNotifEmailsJCPayload } from '@of-mono/common/contracts/contacts-service/jobs-contracts/send-notif-emails.JC';
import { logger } from '@of-mono/common/lib/logger';

@Service({ transient: true })
export class SendNotifyEmailsUseCase {

	constructor(
		private broker: Broker, 
	) {}

	public async execute(data: SendNotifEmailsJCPayload): Promise<void> {
		logger.info({
			message: 'SENDING EMAIL',
			payload: data
		})
	}
}
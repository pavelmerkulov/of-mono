import { Controller } from '@of-mono/common/src/lib/contract-util/decorators/controller';
import { logger } from '@of-mono/common/src/lib/logger';
import { Container as DiContainer } from 'typedi';
import { SendNotifEmailsJC, Payload as SendNotifEmailsJCPayload } from '@of-mono/common/src/contracts/contacts-service/jobs-contracts/send-notif-emails.JC';
import { Job } from '@of-mono/common/src/lib/contract-util/decorators/job';
import { SendNotifyEmailsUseCase } from '../use-cases/send-notify-emails.use-case';

@Controller
export class ContactJobController {
	@Job(SendNotifEmailsJC)
	async sendEmail(payload: SendNotifEmailsJCPayload) {
		logger.info({
			message: "GOT JOB SEND EMAIL",
			payload
		})

		const useCase = DiContainer.get(SendNotifyEmailsUseCase);
		await useCase.execute(payload);
	}
}
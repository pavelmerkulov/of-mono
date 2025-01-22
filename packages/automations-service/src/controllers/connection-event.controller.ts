import { Controller } from '@of-mono/common/lib/contract-util/decorators/controller';
import { Event } from '@of-mono/common/lib/contract-util/decorators/event';
import { ConnectionCreatedEC, Payload as ConnectionCreatedECPayload } from "@of-mono/common/contracts/automations-service/event-contracts/connection-created.EC";
import { logger } from '@of-mono/common/lib/logger';

@Controller
export class ConnectionEventController {
	@Event(ConnectionCreatedEC, { groupId: 'kafka-group-2', concurrency: 10 })
	async handleConnectionCreated(payload: ConnectionCreatedECPayload) {
		logger.info({
			message: "GOT EVENT CONNECTION CREATED",
			payload
		})
	}
}
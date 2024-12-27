import { Controller } from '@of-mono/common/src/lib/contract-util/decorators/controller';
import { Request } from '@of-mono/common/src/lib/contract-util/decorators/request';
import { Event } from '@of-mono/common/src/lib/contract-util/decorators/event';
import { CreateConnectionRC, RequestPayload as CreateRequestPayload, ResponsePayload as CreateResponsePayload  } from "@of-mono/common/src/contracts/automations-service/request-contracts/create-connection.RC";
import { UpdateConnectionRC, RequestPayload as UpdateRequestPayload } from "@of-mono/common/src/contracts/automations-service/request-contracts/update-connectin.RC";
import { Broker } from '@of-mono/common/src/lib/contract-util/broker';
import { UpdateConnectionUseCase } from '../use-cases/update-connection.use-case';
import { ConnectionCreatedEC, Payload as ConnectionCreatedECPayload } from "@of-mono/common/src/contracts/automations-service/event-contracts/connection-created.EC";
import { SendNotifEmailsJC, Payload as SendNotifEmailsJCPayload } from "@of-mono/common/src/contracts/automations-service/job-contracts/send-notif-emails.JC";
import { Job } from '@of-mono/common/src/lib/contract-util/decorators/job';
import { IntegrationApp } from '@of-mono/common/src/types/intergration-app';

@Controller
export class ConnectionController {
	declare broker: Broker;

	@Request(CreateConnectionRC)
	async createConnection(reqPayload: CreateRequestPayload): Promise<CreateResponsePayload> {
		console.log('********************************** REQUEST');
		console.dir(CreateConnectionRC.manifest);
		console.dir(reqPayload);
        
		// send event to kafka
        await this.broker.sendEvent(ConnectionCreatedEC, { id: '777' })

		return {
			id: '777'
		}
	}

	@Request(UpdateConnectionRC)
	async updateConnection(reqPayload: UpdateRequestPayload) {
		console.log('********************************** REQUEST');
		console.dir(UpdateConnectionRC.manifest);
		console.dir(reqPayload);

		const useCase = new UpdateConnectionUseCase(this.broker);
		return useCase.execute(reqPayload);
	}

	@Event(ConnectionCreatedEC, { groupId: 'kafka-grpup-1', concurrency: 10 })
	async handleConnectionCreated(payload: ConnectionCreatedECPayload) {
		console.log('********************************** EVENT');
		console.dir(ConnectionCreatedEC.manifest);
		console.dir(payload);

		// adding new Job
		this.broker.addJob(SendNotifEmailsJC, {
			id: payload.id, email: 'test@test.ee'
		})
	}

	@Job(SendNotifEmailsJC)
	async handleSendNotifEmailJon(payload: SendNotifEmailsJCPayload) {
		console.log('************************************ JOB');
		console.dir(SendNotifEmailsJC.manifest)
		console.dir(payload);

		// making http request to some service
		this.broker.sendRequest(UpdateConnectionRC, {
			connectionId: '444444',
			sourceApp: IntegrationApp.google,
			destinationApp: IntegrationApp.mailchimp
		})	
	}
}
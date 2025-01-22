import { Controller } from '@of-mono/common/lib/contract-util/decorators/controller';
import { Request } from '@of-mono/common/lib/contract-util/decorators/request';
import { CreateConnectionRC, RequestPayload as CreateConnectionRequestPayload, ResponsePayload as CreateConnectionResponsePayload  } from "@of-mono/common/contracts/automations-service/request-contracts/create-connection.RC";
import { Container as DiContainer } from 'typedi';
import { CreateConnectionUseCase } from '../use-cases/create-connection.use-case';
import { CreateConnectionContactRC, RequestPayload as CreateContactRequestPayload, ResponsePayload as CreateContactResponsePayload  } from "@of-mono/common/contracts/automations-service/request-contracts/create-connection-contact.RC";
import { Broker } from '@of-mono/common/lib/contract-util/broker';
import { CreateContactRC } from '@of-mono/common/contracts/contacts-service/request-contracts/create-contact.RC';


@Controller
export class ConnectionHttpController {
	
	@Request(CreateConnectionRC)
	async createConnection(reqPayload: CreateConnectionRequestPayload): Promise<CreateConnectionResponsePayload> {
		const useCase = DiContainer.get(CreateConnectionUseCase);
		return useCase.execute(reqPayload);
	}

	@Request(CreateConnectionContactRC)
	async createContact(reqPayload: CreateContactRequestPayload): Promise<CreateContactResponsePayload> {
		const broker = DiContainer.get(Broker);

		return broker.sendRequest(CreateContactRC, {
			connectionId: reqPayload.connectionId,
			email: reqPayload.email,
			firstName: reqPayload.firstName,
			lastName: reqPayload.lastName
		})
	} 
}
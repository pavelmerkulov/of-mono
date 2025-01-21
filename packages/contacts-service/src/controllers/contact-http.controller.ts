import { Controller } from '@of-mono/common/src/lib/contract-util/decorators/controller';
import { Request } from '@of-mono/common/src/lib/contract-util/decorators/request';
import { CreateContactRC, RequestPayload as CreateRequestPayload, ResponsePayload as CreateResponsePayload  } from "@of-mono/common/src/contracts/contacts-service/request-contracts/create-contact.RC";
import { Container as DiContainer } from 'typedi';
import { CreateContactUseCase } from '../use-cases/create-contact.use-case';

@Controller
export class ContactHttpController {
	@Request(CreateContactRC)
	async createContact(reqPayload: CreateRequestPayload): Promise<CreateResponsePayload> {
		const useCase = DiContainer.get(CreateContactUseCase);
		return useCase.execute(reqPayload);
	}
}
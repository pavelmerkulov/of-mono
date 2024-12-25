import { RequestPayload } from "@of-mono/common/src/contracts/automations-service/request-contracts/update-connectin.RC";
import { Broker } from "@of-mono/common/src/lib/contract-util/broker";

export class UpdateConnectionUseCase {
    constructor(private broker: Broker) {}

    public execute(data: RequestPayload) {
        //
    }
}
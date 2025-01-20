import { ConnectionCreatedEC } from "@of-mono/common/src/contracts/automations-service/event-contracts/connection-created.EC";
import { RequestPayload, ResponsePayload } from "@of-mono/common/src/contracts/automations-service/request-contracts/create-connection.RC";
import { Broker } from "@of-mono/common/src/lib/contract-util/broker";

export class CreateConnectionUseCase {
    constructor(private broker: Broker) {}

    // public async execute(data: RequestPayload): Promise<ResponsePayload> {
        
    //     // send event to kafka
    //     await this.broker.sendEvent(ConnectionCreatedEC, {
    //         id: '777888'
    //     })
        
    //     return {
    //         id: '777'
    //     };
    // }
}
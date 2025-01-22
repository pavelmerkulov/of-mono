import { ConnectionCreatedEC } from "@of-mono/common/contracts/automations-service/event-contracts/connection-created.EC";
import { RequestPayload, ResponsePayload } from "@of-mono/common/contracts/automations-service/request-contracts/create-connection.RC";
import { Broker } from "@of-mono/common/lib/contract-util/broker";
import { Service } from 'typedi';
import { ConnectionsRepository } from "../repositories/connections-repository";
import { Connection } from "../models/Connection";

@Service({ transient: true })
export class CreateConnectionUseCase {

    constructor(
        private broker: Broker, 
        private connectionsRepository: ConnectionsRepository
    ) {}

    public async execute(data: RequestPayload): Promise<ResponsePayload> {
        const connection = new Connection();
        connection.sourceApp = data.sourceApp;
        connection.destinationApp = data.destinationApp;
        await this.connectionsRepository.saveConnection(connection);

        this.broker.sendEvent(ConnectionCreatedEC, connection);

        return {
            id: connection.id
        }
    }
}
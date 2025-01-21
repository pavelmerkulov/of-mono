
# Notes on the Codebase

Since all our microservices are implemented in Node.js and only one team works on them, it makes sense to use a monorepo.
This offers the following advantages:
- Easier to share common code among all microservices. There's no need for a separate repository for our internal npm packages.
- Simplifies npm dependency management. When we want to upgrade to a new version of a library, we don't need to make changes in each repository (very time-consuming).
- Easier to work on new features. If we have separate repositories for each service and work on a feature requiring changes across multiple services, we would need to create separate branches in each repository (very time-consuming).
- Easier to maintain shared code.

To organize the monorepo, npm workspaces were used.
All code is divided into packages. A package can either be a standalone application or shared code for all applications. Such a package is called `common`.

---

# Notes on Code Design

The main challenge when working with microservices is communication and their dependencies. 
Services can make HTTP requests, send Kafka messages, and add or process tasks from BullMQ. 
If this is done traditionally, without advanced approaches or solutions, it turns into chaos. 
This leads to duplicate code, no clear understanding of which service sends what data, and, most importantly, how this data is structured.

The key aspect of working with microservices is defining **contracts**. A contract is a clear description of all structures used by a service to process HTTP requests, Kafka events, and Bull tasks. Contracts should be available to all services, and the logic for sending and processing messages should be automatically generated based on these contracts. The project should not have scattered consumers and handlers for different types of messages. Everything should be automated based on contracts.

This prototype provides a solution to this problem. 
In the `common` package, there is a `contracts` folder. For each of our services, there will be a corresponding folder containing contracts for working with HTTP (which requests the service processes), Kafka (which events the service generates), and Bull (which tasks the service processes).

For example, a contract for processing an HTTP request to create a new "Connection" in "Automation-service" might look like this:

```typescript
import { RequestContract } from "../../../lib/contract-util/contracts/request-contract";
import Joi from 'joi';

export class RequestPayload {
    sourceApp: 'pipedrive' | 'google' = 'pipedrive'; 
    destinationApp: 'mailchimp' | 'activecamp' = 'mailchimp';
}

export class ResponsePayload {
    id: string = ''; 
}

export const CreateConnectionRC = new RequestContract({
    url: '/connections',
    method: 'POST',
    hostAlias: 'AUTOMATIONS_SERVICE',
    
    requestPayload: new RequestPayload(),
    requestPayloadSchema: Joi.object({
        sourceApp: Joi.valid('pipedrive', 'google'),
        destinationApp: Joi.valid('mailchimp', 'activecamp'),
    }),
    
    responsePayload: new ResponsePayload(),
    responsePayloadSchema: Joi.object({
        id: Joi.string(),
    })
});
```

To allow `automation-service` to process such requests, all you need to do is add a controller file and annotate one of the class methods to handle requests corresponding to this contract:

```typescript
@Controller
class ConnectionController {
    declare broker: Broker;

    @Request(CreateConnectionRC)
    async createConnection(reqPayload: CreateRequestPayload): Promise<CreateResponsePayload> {
        // Execute some scenario
    }
}
```

For another service to make a request to create a "Connection", all it needs to do is import the corresponding contract and send the request:

```typescript
this.broker.sendRequest(CreateConnectionRC, {
    connectionId: '444444',
    sourceApp: 'google',
    destinationApp: 'mailchimp'
});
```

Similarly, sending and receiving Kafka events and BullMQ tasks works by annotating methods in the controller with the corresponding contract:

```typescript
@Controller
class ConnectionController {
    declare broker: Broker;

    @Event(ConnectionCreatedEC, { groupId: 'kafka-group-1', concurrency: 10 })
    async handleConnectionCreated(payload: ConnectionCreatedECPayload) {
        // Process Kafka messages
    }

    @Job(SendNotifEmailsJC)
    async handleSendNotifEmailJob(payload: SendNotifEmailsJCPayload) {
        // Process Bull tasks
    }
}
```

To add a message to Kafka or a task to Bull, any service can simply call the methods:

```typescript
// Add a Kafka event based on a contract
await this.broker.sendEvent(ConnectionCreatedEC, { id: '777' });

// Add a Bull task to the queue based on a contract
this.broker.addJob(SendNotifEmailsJC, {
    id: '888', email: 'test@test.ee'
});
```

It is important to note that all message sending and receiving is type-safe.
During the code-writing (and compilation) stage, all necessary checks for data compliance with the described contracts are automatically performed.

### Benefits of This Approach
- Clear, structured descriptions of the public interface of each service, which significantly simplifies maintenance.
- Significant code simplification and reduction.
- To interact with one service from another, add a Kafka event, or add a Bull task, no additional code needs to be written—just export the contract and make the request.

### Remarks
- The proposed prototype lacks many useful features, such as proper configuration management, error handling, logging, etc. The goal was to demonstrate a contract-based communication method for services.


### Some commands

- Launching services
```
npm run dev --workspace=@of-mono/automations-service
```
```
npm run dev --workspace=@of-mono/contacts-service
```

- Creating a New Connection
  - A new connection will be created.
  - The ConnectionCreated event will be emitted.

```
curl -i -X POST http://localhost:3002/connections -H "Content-Type: application/json" -d '{"sourceApp":"pipedrive","destinationApp":"mailchimp"}'
```

- Creating a New Contact for the Connection
  - The Automation Service will call the Contacts Service.
  - A contact will be created in the Contacts Service.
  - The ContactCreated event will be emitted by the Contacts Service.
  - The ContactCreated event will be handled by the Contacts Service, which will add the SendNotifyEmail job to the queue.
  - The Contacts Service will process the SendNotifyEmail job, resulting in the email being sent.

```
curl -i -X POST http://localhost:3002/connections/111/contacts -H "Content-Type: application/json" -d '{"email":"test@local.ee", "firstName": "Bill", "lastName": "Gates"}'
```

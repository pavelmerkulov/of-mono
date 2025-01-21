import express from 'express';
import { Application } from '@of-mono/common/src/lib/contract-util/application';
import { HttpEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/http-engine';
import { KafkaEventEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/kafka-event-engine';
import { BullJobEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/bull-job-engine';
import { Container as DiContainer } from 'typedi';
import { Broker } from '@of-mono/common/src/lib/contract-util/broker';

// we can configure our express app as we want
const expressApp = express();
expressApp.use(
    express.json()
);


const app = new Application({
    controllersDir: `${__dirname}/controllers`,
}) 

// allow working with HTTP - handling and sending requests
app.usePlugin(new HttpEngine(
    expressApp,
    {
        port: 3002,
        hosts: [
            { alias: 'AUTOMATIONS_SERVICE', url: 'http://localhost:3002' },
            { alias: 'CONTACTS_SERVICE', url: 'http://localhost:3003' },
        ],
        validateInputRequest: true,
        validateOutputRequestResponse: true
    }
))

// allow working with kafka - producing and concuming events
app.usePlugin(new KafkaEventEngine({
    kafkaConnection: {
        clientId: 'automations-service',
        brokers: ['of-kafka:9092'],
        ssl: false,
        sasl: null,
        connectionTimeout: 30000,
    }
}))

// allow working with Bull - adding and handling job
app.usePlugin(new BullJobEngine({
    redisConnection: {
        host: 'of-redis',
        port: 6379,             
    }
}))

// we want inject broker to use cases
DiContainer.set(Broker, app.broker);


async function start() {
    await app.start();
}

start();
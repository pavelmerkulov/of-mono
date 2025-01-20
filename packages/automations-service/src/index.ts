import express from 'express';
import { Application } from '@of-mono/common/src/lib/contract-util/application';
import { HttpEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/http-engine';
import { KafkaEventEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/kafka-event-engine';
import { BullJobEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/bull-job-engine';

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
        port: 3003,
        hosts: [
            { alias: 'AUTOMATIONS_SERVICE', url: 'http://localhost:3003' },
            { alias: 'CLIENTS_SERVICE', url: 'http://localhost:3004' },
        ]        
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


async function start() {
    await app.start();
}

start();
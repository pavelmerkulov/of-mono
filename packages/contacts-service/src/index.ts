import express from 'express';
import { Application } from '@of-mono/common/src/lib/contract-util/application';
import { HttpEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/http-engine';
import { KafkaEventEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/kafka-event-engine';
import { BullJobEngine } from '@of-mono/common/src/lib/contract-util/app-plugins/bull-job-engine';
import { Container as DiContainer } from 'typedi';
import { Broker } from '@of-mono/common/src/lib/contract-util/broker';
import { BaseError } from '@of-mono/common/src/lib/base.error';
import { logger } from '@of-mono/common/src/lib/logger';

// we can configure our express app as we want
const expressApp = express();
expressApp.use(
    express.json()
);


const app = new Application({
    controllersDir: `${__dirname}/controllers`,
}) 

// @todo just example
const errorHandler = (err: BaseError) => {
    logger.info({
        error: err.name,
        message: err.message,
        info: err.info,
		stack: err.stack
    })
}


// allow working with HTTP - handling and sending requests
app.usePlugin(new HttpEngine(
    expressApp,
    {
        port: 3003,
        hosts: [
            { alias: 'AUTOMATIONS_SERVICE', url: 'http://localhost:3002' },
            { alias: 'CONTACTS_SERVICE', url: 'http://localhost:3003' },
        ],
        validateInputRequest: true,
        validateOutputRequestResponse: true,
		errorHandler
    }
))

// allow working with kafka - producing and concuming events
app.usePlugin(new KafkaEventEngine({
    kafkaConnection: {
        clientId: 'contacts-service',
        brokers: ['of-kafka:9092'],
        ssl: false,
        sasl: null,
        connectionTimeout: 30000,
    },
	errorHandler
}))

// allow working with Bull - adding and handling job
app.usePlugin(new BullJobEngine({
    redisConnection: {
        host: 'of-redis',
        port: 6379,             
    },
	errorHandler
}))

// we want inject broker to use cases
DiContainer.set(Broker, app.broker);


async function start() {
    await app.start();
}

start();
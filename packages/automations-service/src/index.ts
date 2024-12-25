import express from 'express';
import { HttpServer } from '@of-mono/common/src/lib/contract-util/http-server';
import { KafkaServer } from '@of-mono/common/src/lib/contract-util/kafka-server';
import { BullServer } from '@of-mono/common/src/lib/contract-util/bull-server';
import { Broker } from '@of-mono/common/src/lib/contract-util/broker';
import { Kafka } from 'kafkajs';


// http
const app = express();
app.use(
    express.json()
);

// kafka
const kafka = new Kafka({
    clientId: 'automations-service',
    brokers: ['of-kafka:9092'],
    ssl: false
})


const broker = new Broker(app, kafka);

async function start() {
    
    // @todo this is only example
    // we should work with settings in more advanced way
    await broker.init({
        controllersDir: `${__dirname}/controllers`,
        redisConnection: {
            host: 'of-redis',
            port: 6379,           
        },
        hosts: [
            { alias: 'AUTOMATIONS_SERVICE', url: 'http://localhost:3003' }
        ]
    })

    const httpServer = new HttpServer(broker);
    await httpServer.start(3003);

    const kafkaServer = new KafkaServer(broker);
    await kafkaServer.start();

    const bullServer = new BullServer(broker);
    await bullServer.start();
}

start();
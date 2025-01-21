import { Kafka, Producer as KafkaProducer } from 'kafkajs';
import { Broker } from '../broker';
import { HandlerRegistry } from '../handler-registry';
import { AppPlugin } from '../app-plugin';
import { EventSender } from '../event-sender';
import { EventContract } from '../contracts/event-contract';

export class KafkaEventEngine implements AppPlugin, EventSender {
	private kafkaProducer!: KafkaProducer;
	private kafka: Kafka;
	
	constructor(private config: {
		kafkaConnection: { 
			clientId: string,
			brokers: string[],
			ssl: boolean,
			sasl: any,
			connectionTimeout: number
		}
	}) {
		this.kafka = new Kafka(config.kafkaConnection)
	}

	async init() {
		const handlers = HandlerRegistry.getEventHandlers();
		
		const map: any = {};

		// group by groupId and topic
		for (const [ contract, callMeta ] of handlers) {
			const { topic, type } = contract.manifest;
			const groupId = callMeta.options?.groupId ?? 'default';
			if (!map[groupId]) {
				map[groupId] = {};
				if (!map[groupId][topic]) {
					map[groupId][topic] = { contract, callMeta };
				}
			}
		}

		//
		for (const groupId in map) {
			const consumer = this.kafka.consumer({ groupId });
			await consumer.connect();
			for (const topic in map[groupId]) {
				await consumer.subscribe({ topic, fromBeginning: true });
			}

			await consumer.run({
				eachMessage: async ({ topic, message }: any) => {
					if (map[groupId][topic]) {
						const { contract, callMeta } =  map[groupId][topic];
						const { payload } = JSON.parse(message.value.toString());
						await callMeta.target[callMeta.methodName](payload);
					}
				},
			});
		}
	}

	async start() {
		//		
	}

	async sendEvent<T extends EventContract<any>>(
		contract: T,
		payload: InstanceType<T['manifest']['payload']>
	) {
		const { topic, type } =  contract.manifest;

		if (!this.kafkaProducer) {
			this.kafkaProducer = this.kafka.producer();
			await this.kafkaProducer.connect();
		}

		await this.kafkaProducer.send({
			topic,
			messages: [
				{ 
					value: JSON.stringify({
						type, payload
					})
				}
			]
		})
	}
}
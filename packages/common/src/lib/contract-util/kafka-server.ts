import { Kafka } from 'kafkajs';
import { Broker } from './broker';
import { HandlerRegistry } from './handler-registry';

export class KafkaServer {
	constructor(private broker: Broker) {}

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
			const consumer = this.broker.kafka.consumer({ groupId });
			await consumer.connect();
			for (const topic in map[groupId]) {
				await consumer.subscribe({ topic, fromBeginning: true });
			}

			await consumer.run({
				eachMessage: async ({ topic, message }: any) => {
					if (map[groupId][topic]) {
						const { contract, callMeta } =  map[groupId][topic];
						const payload = JSON.parse(message.value.toString());
						await callMeta.target[callMeta.methodName](payload);
					}
				},
			});
		}
	}

	async start() {
		await this.init();
	}
}
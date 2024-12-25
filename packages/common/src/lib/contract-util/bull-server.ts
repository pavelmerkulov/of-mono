import { Job, Worker } from 'bullmq';
import { HandlerRegistry } from './handler-registry';
import { Broker } from './broker';

export class BullServer {
	constructor(private broker: Broker) {}

	async init() {
		const handlers = HandlerRegistry.getJobHandlers();

		const map: any = {};

		// group by queue name and job name
		for (const [ contract, callMeta ] of handlers) {
			const { queue, name } = contract.manifest;
			if (!map[queue]) {
				map[queue] = {};
				if (!map[queue][name]) {
					map[queue][name] = { contract, callMeta };
				}
			}
		}

		for (const queue in map) {
			new Worker(queue, async (job: Job) => {
				if (map[queue][job.name]) {
					const { contract, callMeta } = map[queue][job.name];
					const payload = JSON.parse(job.data.toString());
					await callMeta.target[callMeta.methodName](payload);
				}
			}, { connection: this.broker.redisConnection })
		}
	}

	async start() {
		await this.init();
	}
}
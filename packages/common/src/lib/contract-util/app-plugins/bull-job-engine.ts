import { Job, Worker } from 'bullmq';
import { HandlerRegistry } from '../handler-registry';
import { JobSender } from '../job-sender';
import { JobContract } from '../contracts/job-contract';
import { JobsOptions, Queue } from 'bullmq';
import { AppPlugin } from '../app-plugin';

export class BullJobEngine implements AppPlugin, JobSender<JobsOptions> {
	
	private bullQueueMap: { [name: string]: Queue } = {};

	constructor(private config: {
		redisConnection: {
			host: string,
			port: number
		}
	}) {}

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
			}, { connection: this.config.redisConnection })
		}
	}

	async start() {
		//
	}

	async addJob<T extends JobContract<JobsOptions>>(
		contract: T,
		payload: InstanceType<T['manifest']['payload']>,
		opts?: JobsOptions
	): Promise<void> {
		const { queue, name } =  contract.manifest;
		if (!this.bullQueueMap[queue]) {
			this.bullQueueMap[queue] = new Queue(queue, { connection: this.config.redisConnection });
		}

		this.bullQueueMap[queue].add(name, JSON.stringify(payload), opts);
	}
}
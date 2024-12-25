// import axios from 'axios';
import 'reflect-metadata';
import { RequestContract } from "./contracts/request-contract";
import * as path from 'path';
import { glob } from 'glob';
import { EventContract } from './contracts/event-contract';
import { Kafka, Producer as KafkaProducer } from 'kafkajs';
import { JobContract } from './contracts/job-contract';
import { JobsOptions, Queue } from 'bullmq';
import { HostAliases } from '../../types/hosts-aliases';
import axios from 'axios'

function replaceParams(url: string, params: Record<string, string>): string {
	return Object.keys(params).reduce(
		(updatedUrl, key) => updatedUrl.replace(`:${key}`, params[key]),
		url
	);
}

export class Broker {
	private kafkaProducer!: KafkaProducer;
	private bullQueueMap: { [name: string]: Queue } = {};
	public redisConnection!: {
		host: string,
		port: number
	};
	private hostMap: Map<HostAliases, { url: string }> = new Map();

	constructor(
		public app: any,
		public kafka: Kafka,		
	) {}

	private async createControllers(dir: string) {
		const files: any = glob.sync(`${dir}/**/*.ts`, {});
		for (const file of files) {
			const modulePath = path.resolve(file);
			const module = await import(modulePath);

			for (const key in module) {
				const exported = module[key];
				if (typeof exported === 'function' && Reflect.getMetadata('isController', exported)) {
					exported.prototype.broker = this;
					new exported();
				}
			}
		}
	}

	public async init(params: {
		controllersDir: string
		redisConnection: {
			host: string,
			port: number
		}
		hosts: Array<{
			alias: HostAliases,
			url: string
		}>;
	}) {
		await this.createControllers(params.controllersDir);
		this.redisConnection = params.redisConnection;
		params.hosts.forEach(h => {
			this.hostMap.set(h.alias, { url: h.url });
		})
	}

	async sendEvent<T extends EventContract<any>>(
		contract: T,
		payload: T['manifest']['payload']
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
						topic, type, payload
					})
				}
			]
		})
	}

	addJob<T extends JobContract<any>>(
		contract: T,
		payload: T['manifest']['payload'],
		opts?: JobsOptions
	) {
		const { queue, name } =  contract.manifest;
		if (!this.bullQueueMap[queue]) {
			this.bullQueueMap[queue] = new Queue(queue, { connection: this.redisConnection });
		}

		this.bullQueueMap[queue].add(name, JSON.stringify(payload), opts);
	}

	async sendRequest<T extends RequestContract<any, any, any>>(
		contract: T, 
		reqPayload?: T['manifest']['requestPayload'], 
		params?: T['manifest']['urlParams']): Promise<T['manifest']['responsePayload']> 
	{
		//
		if (!this.hostMap.has(contract.manifest.hostAlias)) {
			throw new Error(`Host alias "${contract.manifest.hostAlias}" is not found`);
		}
		let url = `${this.hostMap.get(contract.manifest.hostAlias)?.url}${contract['manifest']['url']}`
		if (params) {
			url = replaceParams(url, params);
		}
		if (reqPayload) {
			url = replaceParams(url, reqPayload);
		}
		
		//
		const method: string = contract['manifest']['method'];
		const response = await axios.request({
			url,
			method,
			data: reqPayload,
		});

		// @todo additional checks, validation etc
		return response.data;
	}
}
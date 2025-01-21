
import { RequestContract } from "./contracts/request-contract";
import { EventContract } from './contracts/event-contract';
import { JobContract } from './contracts/job-contract';
import { JobsOptions } from 'bullmq';
import { RequestSender } from './request-sender';
import { EventSender } from './event-sender';
import { JobSender } from './job-sender';
import { BrokerConfig } from "./broker-config";


export class Broker {
	public requestSender!: RequestSender;
	public eventSender!: EventSender;
	public jobSender!: JobSender<any>;

	constructor(private config: BrokerConfig) {}

	async sendEvent<T extends EventContract<any>>(
		contract: T,
		payload: InstanceType<T['manifest']['payload']>
	) {
		if (!this.eventSender) {
			throw new Error('Event sender is not set');
		}

		return this.eventSender.sendEvent(contract, payload);
	}

	addJob<T extends JobContract<any>>(
		contract: T,
		payload: InstanceType<T['manifest']['payload']>,
		opts?: JobsOptions
	) {
		if (!this.jobSender) {
			throw new Error('Event sender is not set');
		}

		return this.jobSender.addJob(contract, payload, opts);
	}

	async sendRequest<T extends RequestContract<any, any, any>>(
		contract: T, 
		reqPayload?: InstanceType<T['manifest']['requestPayload']>, 
		params?: InstanceType<T['manifest']['urlParams']>): Promise<InstanceType<T['manifest']['responsePayload']>> 
	{
		if (!this.requestSender) {
			throw new Error('Request sender is not set');
		}
		
		return this.requestSender.sendRequest(contract, reqPayload, params);
	}
}
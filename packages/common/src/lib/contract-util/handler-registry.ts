import { RequestOptions } from "https";
import { EventContract } from "./contracts/event-contract";
import { JobContract } from "./contracts/job-contract";
import { RequestContract } from "./contracts/request-contract";
import { EventOptions } from "./decorators/event";
import { JobOptions } from "./decorators/job";

interface CallMeta<Options>{
	target: any; 
	methodName: string; 
	options?: Options;
}

export class HandlerRegistry {
	private static requestHandlers: Map<RequestContract<any, any, any>, CallMeta<RequestOptions>> = new Map();
	private static eventHandlers: Map<EventContract<any>, CallMeta<EventOptions>> = new Map();
	private static jobHandlers: Map<JobContract<any>, CallMeta<JobOptions>> = new Map();

	static registerRequestHandler(requestContract: RequestContract<any, any, any>, handler: CallMeta<RequestOptions>) {
		if (this.requestHandlers.has(requestContract)) {
			throw new Error('Request handler already exists');
		}
		this.requestHandlers.set(requestContract, handler);
	}

	static registerEventHandler(eventContract: EventContract<any>, handler: CallMeta<EventOptions>) {
		if (this.eventHandlers.has(eventContract)) {
			throw new Error('Event handler already exists');
		}
		this.eventHandlers.set(eventContract, handler);
	}

	static registerJobHandler(jobContract: JobContract<any>, handler: CallMeta<JobOptions>) {
		if (this.jobHandlers.has(jobContract)) {
			throw new Error('Job handler already exists');
		}
		this.jobHandlers.set(jobContract, handler);
	}

	static getRequestHandlers() {
		return this.requestHandlers.entries();
	}

	static getEventHandlers() {
		return this.eventHandlers.entries();
	}

	static getJobHandlers() {
		return this.jobHandlers.entries();
	}
}
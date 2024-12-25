import { JobContract } from "../contracts/job-contract";
import { HandlerRegistry } from "../handler-registry";

export interface JobOptions {
	concurrency?: number
} 

export function Job(
	jobContract: JobContract<any>,
	options?: JobOptions
) {
	return function (
		target: any,
		methodName: string,
		descriptor: PropertyDescriptor
	) {
		HandlerRegistry.registerJobHandler(jobContract, { target, methodName, options });
		return descriptor;
	};
}
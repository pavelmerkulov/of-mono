import { EventContract } from "../contracts/event-contract";
import { HandlerRegistry } from "../handler-registry";

export interface EventOptions {
	groupId: string; concurrency?: number
}

export function Event(
	eventContract: EventContract<any>,
	options: EventOptions
) {
	return function (
		target: any,
		methodName: string,
		descriptor: PropertyDescriptor
	) {
		HandlerRegistry.registerEventHandler(eventContract, { target, methodName, options });
		return descriptor;
	};
}
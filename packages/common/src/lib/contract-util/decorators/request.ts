import { HandlerRegistry } from "../handler-registry";
import { RequestContract } from "../contracts/request-contract";

export interface RequestOptions {};

export function Request(
	requestContract: RequestContract<any, any, any>,
	options?: RequestOptions
) {
	return function (
		target: any,
		methodName: string,
		descriptor: PropertyDescriptor
	) {
		HandlerRegistry.registerRequestHandler(requestContract, { target, methodName, options });
		return descriptor;
	};
}
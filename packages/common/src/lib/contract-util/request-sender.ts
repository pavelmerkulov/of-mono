import { RequestContract } from "./contracts/request-contract";

export interface RequestSender {
	sendRequest<T extends RequestContract<any, any, any>>(
			contract: T, 
			reqPayload?: InstanceType<T['manifest']['requestPayload']>, 
			params?: InstanceType<T['manifest']['urlParams']>): Promise<InstanceType<T['manifest']['responsePayload']>>;
}


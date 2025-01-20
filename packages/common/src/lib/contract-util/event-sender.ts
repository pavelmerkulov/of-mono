import { EventContract } from "./contracts/event-contract";

export interface EventSender {
	sendEvent<T extends EventContract<any>>(
		contract: T,
		payload: InstanceType<T['manifest']['payload']>
	): Promise<void>;
}
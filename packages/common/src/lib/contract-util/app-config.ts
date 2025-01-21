import { BrokerConfig } from "./broker-config";

export interface AppConfig {
	controllersDir: string
	broker?: BrokerConfig;
}
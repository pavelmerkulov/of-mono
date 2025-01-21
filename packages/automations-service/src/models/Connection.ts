import { IntegrationApp } from "@of-mono/common/src/types/intergration-app";

export class Connection {
	id!: string;
	sourceApp!: IntegrationApp;
	destinationApp!: IntegrationApp;
	createdAt!: Date;
}
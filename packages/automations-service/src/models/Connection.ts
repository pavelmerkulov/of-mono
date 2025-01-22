import { IntegrationApp } from "@of-mono/common/types/intergration-app";

export class Connection {
	id!: string;
	sourceApp!: IntegrationApp;
	destinationApp!: IntegrationApp;
	createdAt!: Date;
}
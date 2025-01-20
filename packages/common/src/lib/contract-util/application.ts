import 'reflect-metadata';
import { AppPlugin } from "./app-plugin";
import { Broker } from "./broker";
import { EventSender } from "./event-sender";
import { JobSender } from "./job-sender";
import { RequestSender } from "./request-sender";
import * as path from 'path';
import { glob } from 'glob';

export class Application {
	private plugins: AppPlugin[] = [];
	private broker: Broker;
	private isControllerCreated = false;
	
	private async checkAndCreateControllers() {
		if (this.isControllerCreated) return;
		
		const files: any = glob.sync(`${this.config.controllersDir}/**/*.ts`, {});
		for (const file of files) {
			const modulePath = path.resolve(file);
			const module = await import(modulePath);

			for (const key in module) {
				const exported = module[key];
				if (typeof exported === 'function' && Reflect.getMetadata('isController', exported)) {
					exported.prototype.broker = this;
					new exported();
				}
			}
		}
	}

	async usePlugin(plugin: AppPlugin) {
		this.plugins.push(plugin);

		const pl = plugin as any;

		if (typeof pl['sendRequest'] === 'function') {
			this.broker.requestSender = plugin as unknown as RequestSender;
		}

		if (typeof pl['sendEvent'] === 'function') {
			this.broker.eventSender = plugin as unknown as EventSender;
		}

		if (typeof pl['addJob'] === 'function') {
			this.broker.jobSender = plugin as unknown as JobSender<any>;
		}

		return plugin.init();
	}
	
	constructor(private config: AppConfig) {
		this.broker = new Broker(config.broker)
	}	

	async start() {
		await this.checkAndCreateControllers()

		for (const plugin of this.plugins) {
			await plugin.start();
		}
	}
}
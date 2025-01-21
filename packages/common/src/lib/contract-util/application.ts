import 'reflect-metadata';
import { AppPlugin } from "./app-plugin";
import { Broker } from "./broker";
import { EventSender } from "./event-sender";
import { JobSender } from "./job-sender";
import { RequestSender } from "./request-sender";
import * as path from 'path';
import { glob } from 'glob';
import { AppConfig } from './app-config';

export class Application {
	private plugins: AppPlugin[] = [];
	public broker: Broker;
	private isControllerCreated = false;
	private isPluginsInit = false;
	
	private async checkAndCreateControllers() {
		if (this.isControllerCreated) return;
		
		const files: any = glob.sync(`${this.config.controllersDir}/**/*.ts`, {});
		for (const file of files) {
			const modulePath = path.resolve(file);
			const module = await import(modulePath);

			for (const key in module) {
				const exported = module[key];
				if (typeof exported === 'function' && Reflect.getMetadata('isController', exported)) {
					new exported();
				}
			}
		}

		this.isControllerCreated = true;
	}

	private async initPlugins() {
		if (this.isPluginsInit) return;

		for (const plugin of this.plugins) {
			await plugin.init();
		}

		this.isPluginsInit = true;
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
	}
	
	constructor(private config: AppConfig) {
		this.broker = new Broker(config.broker ?? {})
	}	

	async start() {
		await this.checkAndCreateControllers()
		await this.initPlugins();

		for (const plugin of this.plugins) {
			await plugin.start();
		}
	}
}
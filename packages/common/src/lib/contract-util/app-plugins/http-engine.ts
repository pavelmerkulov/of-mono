import { HandlerRegistry } from '../handler-registry';
import { Request, Response } from 'express';
import { AppPlugin } from '../app-plugin';
import { RequestSender } from '../request-sender';
import { RequestContract } from '../contracts/request-contract';
import axios from 'axios'

function replaceParams(url: string, params: Record<string, string>): string {
	return Object.keys(params).reduce(
		(updatedUrl, key) => updatedUrl.replace(`:${key}`, params[key]),
		url
	);
}

export class HttpEngine implements AppPlugin, RequestSender {
	private hostMap: Map<string, { url: string }> = new Map();
	
	constructor(
		private expressApp: any,
		private config: {
			port: number,
			hosts: Array<{ alias: string, url: string }>;
		}
	) {
		config.hosts.forEach(h => {
			this.hostMap.set(h.alias, { url: h.url });
		})
	}
	
	async init() {
		const handlers = HandlerRegistry.getRequestHandlers();
		for (const [ contract, callMeta ] of handlers) {
			const { url, method } = contract.manifest;
			this.expressApp[method.toLowerCase()](
				url,
				async (req: Request, res: Response) => {
					try {
						let body = { ...req.body, ...req.params};

						
						// @todo
						// we switched to class-validator from Joi
						// we need to add validation here

						// if (contract.manifest.requestPayloadSchema) {
						// 	const { error, value } = contract.manifest.requestPayloadSchema.validate(body);

						// 	if (error) {
						// 		res.status(422).json({
						// 			error: 'validationError',
						// 			message: `Validation failed: ${error.details.map((d: any) => d.message).join(', ')}`
						// 		})
						// 		return;
						// 	} 

						// 	body = value;
						// } 


						const resPyaload = await callMeta.target[callMeta.methodName](body, req.params);
						res.json({
							payload: resPyaload,
							status: 'success'
						});
					} catch (err) {
						res.status(400).json({ error: (err as Error).message });
					}
				}
			);
		}
	}

	async start() {
		this.expressApp.listen(this.config.port, () =>
		  console.log(`HTTP server started on port ${this.config.port}`)
		);
	}	

	async sendRequest<T extends RequestContract<any, any, any>>(contract: T, reqPayload?: InstanceType<T['manifest']['requestPayload']>, params?: InstanceType<T['manifest']['urlParams']>): Promise<InstanceType<T['manifest']['responsePayload']>> {
		if (!this.hostMap.has(contract.manifest.hostAlias)) {
			throw new Error(`Host alias "${contract.manifest.hostAlias}" is not found`);
		}
		let url = `${this.hostMap.get(contract.manifest.hostAlias)?.url}${contract['manifest']['url']}`
		if (params) {
			url = replaceParams(url, params);
		}
		if (reqPayload) {
			url = replaceParams(url, reqPayload);
		}
		
		//
		const method: string = contract['manifest']['method'];
		const response = await axios.request({
			url,
			method,
			data: reqPayload,
		});

		// @todo additional checks, validation etc
		return response.data;
	}
}
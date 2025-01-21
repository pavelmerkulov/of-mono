import { HandlerRegistry } from '../handler-registry';
import { Request, Response } from 'express';
import { AppPlugin } from '../app-plugin';
import { RequestSender } from '../request-sender';
import { RequestContract } from '../contracts/request-contract';
import axios from 'axios';
import { validateObject } from '../../validation/validate-object';
import { ValidationError } from '../../validation/validation.error';
import { NotValidRequestResponseError } from '../../../errors/not-valid-request-response.error';

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
			hosts: Array<{ alias: string, url: string }>,
			validateInputRequest: boolean,
			validateOutputRequestResponse: boolean
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

						if (this.config.validateInputRequest) {
							await validateObject(body, contract.manifest.requestPayload, {});
						}

						const resPyaload = await callMeta.target[callMeta.methodName](body, req.params);
						res.json({
							data: resPyaload,
							status: 200,
							success: true
						});
					} catch (error) {
						const err: any = error;

						let statusCode = 400;
						if (err.statusCode !== undefined) {
							statusCode = err.statusCode;
						}

						res.status(statusCode).json({
							success: false,
							status: statusCode,
							error: err.message ?? err.name,
							data: err.info
						})
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

		if (this.config.validateOutputRequestResponse) {
			try {
				await validateObject(response.data.data, contract.manifest.responsePayload, {});
			} catch (err) {
				if (err instanceof ValidationError) {
					throw new NotValidRequestResponseError(undefined, {
						contract,
						responseData: response.data.data
					})
				} else {
					throw err;
				}
			}
		}

		return response.data;
	}
}
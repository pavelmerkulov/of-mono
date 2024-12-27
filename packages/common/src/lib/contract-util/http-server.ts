import { Broker } from './broker';
import { HandlerRegistry } from './handler-registry';
import { Request, Response } from 'express';

export class HttpServer {
	constructor(private broker: Broker) {}

	private async init() {
		const handlers = HandlerRegistry.getRequestHandlers();
		for (const [ contract, callMeta ] of handlers) {
			const { url, method } = contract.manifest;
			this.broker.app[method.toLowerCase()](
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

	async start(port: number) {
		await this.init();

		this.broker.app.listen(port, () =>
		  console.log(`HTTP server started on port ${port}`)
		);
	}	
}
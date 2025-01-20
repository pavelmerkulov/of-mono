import { HostAliases } from "../../../types/hosts-aliases";


interface Manifest<RequestPayload, ResponsePayload, UrlParams> {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	hostAlias: HostAliases;
	requestPayload: new() => RequestPayload;
	responsePayload: new() => ResponsePayload;
	urlParams: new() => UrlParams;
}

export class RequestContract<RequestPayload, ResponsePayload, UrlParams> {
	constructor(
		public readonly manifest: Manifest<RequestPayload, ResponsePayload, UrlParams>
	){
		Object.freeze(this);
	}
}
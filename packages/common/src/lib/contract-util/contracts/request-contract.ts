import { HostAliases } from "../../../types/hosts-aliases";


interface Manifest<TRequestPayload, TResponsePayload, TUrlParams> {
	name: string;
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	hostAlias: HostAliases;
	requestPayload: new() => TRequestPayload;
	responsePayload: new() => TResponsePayload;
	urlParams: new() => TUrlParams;
}

export class RequestContract<TRequestPayload, TResponsePayload, TUrlParams> {
	constructor(
		public readonly manifest: Manifest<TRequestPayload, TResponsePayload, TUrlParams>
	){
		Object.freeze(this);
	}
}
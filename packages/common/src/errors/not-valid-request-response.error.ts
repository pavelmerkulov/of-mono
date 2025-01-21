import { BaseError } from "../lib/base.error";
import { RequestContract } from "../lib/contract-util/contracts/request-contract";

// @todo we need to add types for TInfo
export class NotValidRequestResponseError extends BaseError<{
	contract: RequestContract<any, any, any>,
	responseData: any
}> {}

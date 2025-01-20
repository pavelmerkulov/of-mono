import { JobContract } from "./contracts/job-contract";

export interface JobSender<TJobsOptoins> {
	addJob<T extends JobContract<any>>(
		contract: T,
		payload: InstanceType<T['manifest']['payload']>,
		opts?: TJobsOptoins
	): Promise<void>
}
import { Connection } from "../models/Connection";
import { Service } from 'typedi';

@Service()
export class ConnectionsRepository {
	async saveConnection(connection: Connection): Promise<Connection> {
		connection.id = '111';
		return connection;
	}
}
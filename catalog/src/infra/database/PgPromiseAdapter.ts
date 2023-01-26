import pgp from "pg-promise";
import Connection from "./Connection";

export default class PgPromiseAdapter implements Connection {
	pgp: any;

	constructor () {
		this.pgp = pgp()("postgres://postgres:1234@localhost:5432/cccat8");
	}
	
	query(statement: string, params: any): Promise<any> {
		return this.pgp.query(statement, params);
	}
	
	async close(): Promise<void> {
		this.pgp.$pool.end();
	}
}
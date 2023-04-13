import Checkout from "../../application/Checkout";
import GetOrdersByCpf from "../../application/GetOrdersByCpf";
import Preview from "../../application/Preview";
import SimulateFreight from "../../application/SimulateFreight";
import ValidateCoupon from "../../application/ValidateCoupon";
import GetOrdersByCpfQuery from "../../application/query/GetOrdersByCpfQuery";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class OrderController {

	constructor (
		readonly httpServer: HttpServer,
		readonly preview: Preview, 
		readonly checkout: Checkout,
		readonly getOrdersByCpf: GetOrdersByCpf,
		readonly validateCoupon: ValidateCoupon,
		readonly getOrdersByCpfQuery: GetOrdersByCpfQuery,
		readonly queue: Queue
	) {
		httpServer.on("post", "/preview", async function (params: any, body: any) {
			const total = await preview.execute(body);
			return { total };
		});
		
		// command
		httpServer.on("post", "/checkout", async function (params: any, body: any) {
			// await checkout.execute(body)
			await queue.publish("placeOrder", body);
		});

		httpServer.on("post", "/validateCoupon", async function (params: any, body: any) {
			const output = await validateCoupon.execute(body);
			return output;
		});
		
		httpServer.on("get", "/orders/:cpf", async function (params: any, body: any) {
			const orders = await getOrdersByCpfQuery.execute(params.cpf);
			return orders;
		});
	}
}

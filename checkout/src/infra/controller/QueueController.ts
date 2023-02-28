import Checkout from "../../application/Checkout";
import Queue from "../queue/Queue";

export default class QueueController {

    constructor (readonly queue: Queue, readonly checkout: Checkout) {
        // handler
        queue.on("placeOrder", "placeOrder.checkout", async function (msg: any) {
            await checkout.execute(msg);
        });
    }
}
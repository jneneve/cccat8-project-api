import Checkout from "./application/Checkout";
import GetOrdersByCpf from "./application/GetOrdersByCpf";
import Preview from "./application/Preview";
import SimulateFreight from "./application/SimulateFreight";
import Coupon from "./domain/entity/Coupon";
import Dimension from "./domain/entity/Dimension";
import Item from "./domain/entity/Item";
import RestController from "./infra/controller/RestController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import MemoryRepositoryFactory from "./infra/factory/MemoryRepositoryFactory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HapiHttp from "./infra/http/HapiAdapters";
import CouponRepositoryMemory from "./infra/repository/memory/CouponRepositoryMemory";
import ItemRepositoryDatabase from "./infra/repository/database/ItemRepositoryDatabase";
import ZipcodeRepositoryDatabase from "./infra/repository/database/ZipcodeRepositoryDatabase";
import ItemRepositoryMemory from "./infra/repository/memory/ItemRepositoryMemory";
import OrderRepositoryMemory from "./infra/repository/memory/OrderRepositoryMemory";
import CalculateFreightGateway from "./application/gateway/CalculateFreightGateway";
import CalculateFreightHttpGateway from "./infra/gateway/CalculateFreightHttpGateway";
import GetItemHttpGateway from "./infra/gateway/GetItemHttpGateway";
import DecrementStockHttpGateway from "./infra/gateway/DecrementStockHttpGateway";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/controller/QueueController";

async function init () {
    const connection = new PgPromiseAdapter();
    const itemRepository = new ItemRepositoryDatabase(connection);
    const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    const repositoryFactory = new MemoryRepositoryFactory();
    couponRepository.save(new Coupon("VALE20", 20));
    const zipcodeRepository = new ZipcodeRepositoryDatabase(connection);
    const getItemGateway = new GetItemHttpGateway();
    const calculateFreightGateway = new CalculateFreightHttpGateway();
    const decrementStockGateway = new DecrementStockHttpGateway();
    const preview = new Preview(couponRepository, getItemGateway, calculateFreightGateway);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway, queue);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const simulateFreight = new SimulateFreight(itemRepository, zipcodeRepository);
    const httpServer = new ExpressAdapter();
    // const httpServer = new HapiHttp();
    new RestController(httpServer, preview, checkout, getOrdersByCpf, simulateFreight, queue);
    new QueueController(queue, checkout);
    httpServer.listen(3000);
}

init();
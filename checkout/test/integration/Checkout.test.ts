import Checkout from "../../src/application/Checkout";
import GetItemGateway from "../../src/application/gateway/GetItemGateway";
import GetOrdersByCpf from "../../src/application/GetOrdersByCpf";
import Coupon from "../../src/domain/entity/Coupon";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import MemoryRepositoryFactory from "../../src/infra/factory/MemoryRepositoryFactory";
import CalculateFreightHttpGateway from "../../src/infra/gateway/CalculateFreightHttpGateway";
import DecrementStockHttpGateway from "../../src/infra/gateway/DecrementStockHttpGateway";
import GetItemHttpGateway from "../../src/infra/gateway/GetItemHttpGateway";

let getItemGateway: GetItemGateway;
let calculateFreightGateway: CalculateFreightHttpGateway;
let decrementStockGateway: DecrementStockHttpGateway;

beforeEach(function () {
	getItemGateway = new GetItemHttpGateway();
	calculateFreightGateway = new CalculateFreightHttpGateway();
	decrementStockGateway = new DecrementStockHttpGateway();
});

test("Deve fazer o pedido", async function () {
	const connection = new PgPromiseAdapter();
	const repositoryFactory = new DatabaseRepositoryFactory(connection);
	const orderRepository = repositoryFactory.createOrderRepository();
	await orderRepository.clear();
	const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway);
	const input = {
		cpf: "317.153.361-86",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		]
	};
	await checkout.execute(input);
	const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
	const orders = await getOrdersByCpf.execute("317.153.361-86");
	expect(orders).toHaveLength(1);
	expect(orders[0].total).toBe(6350);
	await connection.close();
});

test("Deve fazer o pedido com desconto", async function () {
	const repositoryFactory = new MemoryRepositoryFactory();
	const itemRepository = repositoryFactory.createItemRepository();
	const orderRepository = repositoryFactory.createOrderRepository();
	itemRepository.save(new Item(1, "Guitarra", 1000));
	itemRepository.save(new Item(2, "Amplificador", 5000));
	itemRepository.save(new Item(3, "Cabo", 30));
	const couponRepository = repositoryFactory.createCouponRepository();
	couponRepository.save(new Coupon("VALE20", 20));
	const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway);
	const input = {
		cpf: "317.153.361-86",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		],
		coupon: "VALE20"
	};
	await checkout.execute(input);
	const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
	const orders = await getOrdersByCpf.execute("317.153.361-86");
	expect(orders).toHaveLength(1);
	expect(orders[0].total).toBe(5132);
});

test("Deve fazer o pedido com desconto expirado", async function () {
	const repositoryFactory = new MemoryRepositoryFactory();
	const itemRepository = repositoryFactory.createItemRepository();
	itemRepository.save(new Item(1, "Guitarra", 1000));
	itemRepository.save(new Item(2, "Amplificador", 5000));
	itemRepository.save(new Item(3, "Cabo", 30));
	const orderRepository = repositoryFactory.createOrderRepository();
	const couponRepository = repositoryFactory.createCouponRepository();
	couponRepository.save(new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00")));
	const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway);
	const input = {
		cpf: "317.153.361-86",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		],
		coupon: "VALE20",
		date: new Date("2022-03-01T10:00:00")
	};
	await checkout.execute(input);
	const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
	const orders = await getOrdersByCpf.execute("317.153.361-86");
	expect(orders).toHaveLength(1);
	expect(orders[0].total).toBe(6350);
});

test("Deve fazer o pedido com desconto não expirado", async function () {
	const repositoryFactory = new MemoryRepositoryFactory();
	const itemRepository = repositoryFactory.createItemRepository();
	const orderRepository = repositoryFactory.createOrderRepository();
	itemRepository.save(new Item(1, "Guitarra", 1000));
	itemRepository.save(new Item(2, "Amplificador", 5000));
	itemRepository.save(new Item(3, "Cabo", 30));
	const couponRepository = repositoryFactory.createCouponRepository();
	couponRepository.save(new Coupon("VALE20", 20, new Date("2022-03-01T10:00:00")));
	const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway);
	const input = {
		cpf: "317.153.361-86",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		],
		coupon: "VALE20",
		date: new Date("2021-03-01T10:00:00")
	};
	await checkout.execute(input);
	const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
	const orders = await getOrdersByCpf.execute("317.153.361-86");
	expect(orders).toHaveLength(1);
	expect(orders[0].total).toBe(5132);
});

test("Deve fazer o pedido com frete", async function () {
	const repositoryFactory = new MemoryRepositoryFactory();
	const itemRepository = repositoryFactory.createItemRepository();
	const orderRepository = repositoryFactory.createOrderRepository();
	itemRepository.save(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3)));
	itemRepository.save(new Item(2, "Amplificador", 5000));
	itemRepository.save(new Item(3, "Cabo", 30));
	const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway);
	const input = {
		cpf: "317.153.361-86",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		]
	};
	await checkout.execute(input);
	const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
	const orders = await getOrdersByCpf.execute("317.153.361-86");
	expect(orders).toHaveLength(1);
	expect(orders[0].total).toBe(6350);
});

test("Deve fazer o pedido com código", async function () {
	const repositoryFactory = new MemoryRepositoryFactory();
	const itemRepository = repositoryFactory.createItemRepository();
	const orderRepository = repositoryFactory.createOrderRepository();
	itemRepository.save(new Item(1, "Guitarra", 1000));
	const checkout = new Checkout(repositoryFactory, getItemGateway, calculateFreightGateway, decrementStockGateway);
	const input = {
		cpf: "317.153.361-86",
		orderItems: [
			{ idItem: 1, quantity: 1 }
		],
		date: new Date("2021-03-01T10:00:00")
	};
	await checkout.execute(input);
	await checkout.execute(input);
	const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
	const orders = await getOrdersByCpf.execute("317.153.361-86");
	expect(orders).toHaveLength(2);
	expect(orders[0].code).toBe("202100000001");
	expect(orders[1].code).toBe("202100000002");
});

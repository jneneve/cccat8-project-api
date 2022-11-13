import Checkout from "../../src/application/Checkout";
import GetOrdersByCpf from "../../src/application/GetOrdersByCpf";
import Coupon from "../../src/domain/entity/Coupon";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import MemoryRespositoryFactory from "../../src/infra/factory/MemoryRepositoryFactory";


test("it should make the order", async function () {
    const repositoryFactory = new MemoryRespositoryFactory();
    const itemRepository = repositoryFactory.createItemRepository();
    const orderRepository = repositoryFactory.createOrderRepository();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const checkout = new Checkout(repositoryFactory);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ]
    }
    await checkout.execute(input);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const orders = await getOrdersByCpf.execute("802.209.960-08");
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(6090);
});

test("it should make the order with discount", async function () {
    const repositoryFactory = new MemoryRespositoryFactory();
    const itemRepository = repositoryFactory.createItemRepository();
    const orderRepository = repositoryFactory.createOrderRepository();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const couponRepository = repositoryFactory.createCouponRepository()
    couponRepository.save(new Coupon("VALE20", 20));
    const checkout = new Checkout(repositoryFactory);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ],
        coupon: "VALE20"
    }
    await checkout.execute(input);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const orders = await getOrdersByCpf.execute("802.209.960-08");
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(4872);
});

test("it should make the order with expired discount", async function () {
    const repositoryFactory = new MemoryRespositoryFactory();
    const itemRepository = repositoryFactory.createItemRepository();
    const orderRepository = repositoryFactory.createOrderRepository();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const couponRepository = repositoryFactory.createCouponRepository();
    couponRepository.save(new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00")));
    const checkout = new Checkout(repositoryFactory);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ],
        coupon: "VALE20",
        date: new Date("2022-03-01T10:00:00")
    }
    await checkout.execute(input);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const orders = await getOrdersByCpf.execute("802.209.960-08");
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(6090);
});

test("it should make the order with not expired discount", async function () {
    const repositoryFactory = new MemoryRespositoryFactory();
    const itemRepository = repositoryFactory.createItemRepository();
    const orderRepository = repositoryFactory.createOrderRepository();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const couponRepository = repositoryFactory.createCouponRepository();
    couponRepository.save(new Coupon("VALE20", 20, new Date("2022-03-01T10:00:00")));
    const checkout = new Checkout(repositoryFactory);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ],
        coupon: "VALE20",
        date: new Date("2021-03-01T10:00:00")
    }
    await checkout.execute(input);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const orders = await getOrdersByCpf.execute("802.209.960-08");
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(4872);
});

test("it should make the order with freight", async function () {
    const repositoryFactory = new MemoryRespositoryFactory();
    const itemRepository = repositoryFactory.createItemRepository();
    const orderRepository = repositoryFactory.createOrderRepository();
    itemRepository.save(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3)));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const checkout = new Checkout(repositoryFactory);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ]
    }
    await checkout.execute(input);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const orders = await getOrdersByCpf.execute("802.209.960-08");
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(6120);
});

test("it should make the order with code", async function () {
    const repositoryFactory = new MemoryRespositoryFactory();
    const itemRepository = repositoryFactory.createItemRepository();
    const orderRepository = repositoryFactory.createOrderRepository();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    const checkout = new Checkout(repositoryFactory);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 }
        ],
        date: new Date("2021-03-01T10:00:00")
    }
    await checkout.execute(input);
    await checkout.execute(input);
    const getOrdersByCpf = new GetOrdersByCpf(orderRepository);
    const orders = await getOrdersByCpf.execute("802.209.960-08");
    expect(orders).toHaveLength(2);
    expect(orders[0].code).toBe("202100000001");
    expect(orders[1].code).toBe("202100000002");
});

import Preview from "../src/application/Preview";
import Coupon from "../src/domain/entity/Coupon";
import Item from "../src/domain/entity/Item";
import CouponRepositoryMemory from "../src/infra/repository/memory/CouponRepositoryMemory";
import ItemRepositoryMemory from "../src/infra/repository/memory/ItemRepositoryMemory";

test("it should simulate a order", async function () {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const couponRepository = new CouponRepositoryMemory();
    const preview = new Preview(itemRepository, couponRepository);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ]
    }
    const total = await preview.execute(input);
    expect(total).toBe(6090);
});

test("it should simulate a order with discount", async function () {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(new Item(1, "Guitarra", 1000));
    itemRepository.save(new Item(2, "Amplificador", 5000));
    itemRepository.save(new Item(3, "Cabo", 30));
    const couponRepository = new CouponRepositoryMemory();
    couponRepository.save(new Coupon("VALE20", 20));
    const preview = new Preview(itemRepository, couponRepository);
    const input = {
        cpf: "802.209.960-08",
        orderItems: [
            { idItem: 1, quantity: 1 },
            { idItem: 2, quantity: 1 },
            { idItem: 3, quantity: 3 }
        ],
        coupon: "VALE20"
    }
    const total = await preview.execute(input);
    expect(total).toBe(4872);
});

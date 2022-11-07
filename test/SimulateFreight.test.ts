import SimulateFreight from "../src/application/SimulateFreight";
import Dimension from "../src/domain/entity/Dimension";
import Item from "../src/domain/entity/Item";
import ItemRepositoryMemory from "../src/infra/repository/memory/ItemRepositoryMemory";

test("it should simulate the freight", async function () {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3)));
    const simulateFreight = new SimulateFreight(itemRepository);
    const input = {
        orderItems: [
            { idItem: 1, quantity: 1 }
        ]
    }
    const freight = await simulateFreight.execute(input);
    expect(freight).toBe(30);
});

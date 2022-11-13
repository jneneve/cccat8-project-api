import Dimension from "../../src/domain/entity/Dimension";
import FreightCalculator from "../../src/domain/entity/FreightCalculator";
import Item from "../../src/domain/entity/Item";

test("it should calculate freight", function () {
    const item = new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3));
    const freight = FreightCalculator.calculate(item);
    expect(freight).toBe(30);
});

test("it should calculate minimum freight", function () {
    const item = new Item(1, "Cabo", 30, new Dimension(1, 1, 1, 0.9));
    const freight = FreightCalculator.calculate(item);
    expect(freight).toBe(10);
});

test("it should calculate freight with distance", function () {
    const item = new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3));
    const distance = 748.2217780081631;
    const freight = FreightCalculator.calculate(item, distance);
    expect(freight).toBe(22.446653340244893);
});

import OrderItem from "../src/domain/entity/OrderItem";

test("it should create a item from order", function () {
    const orderItem = new OrderItem(1, 10, 2);
    expect(orderItem.getTotal()).toBe(20);
});

test("it should not create a item from order with negative quantity", function () {
    expect(() => new OrderItem(1, 10,-1)).toThrow(new Error("Invalid quantity"));
});

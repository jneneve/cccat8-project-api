import Coupon from "../src/domain/entity/Coupon";
import Dimension from "../src/domain/entity/Dimension";
import Item from "../src/domain/entity/Item";
import Order from "../src/domain/entity/Order";

test("it should not create a order with invalid cpf", function () {
   expect(() => new Order("553.852.760-300")).toThrow(new Error("Invalid cpf!"));
});

test("it should create a order with 3 items", function () {
   const order = new Order("802.209.960-08");
   order.addItem(new Item(1, "Air Fryer", 200), 1);
   order.addItem(new Item(2, "Mouse", 50), 2);
   order.addItem(new Item(3, "Teclado", 250), 1);
   const total = order.getTotal();
   expect(total).toBe(550);
});

test("it should create a order without items", function () {
   const order = new Order("802.209.960-08");
   const total = order.getTotal();
   expect(total).toBe(0);
});

test("it should create a order with discount coupon", function () {
   const order = new Order("802.209.960-08");
   order.addItem(new Item(1, "Air Fryer", 200), 1);
   order.addItem(new Item(2, "Mouse", 50), 2);
   order.addItem(new Item(3, "Teclado", 250), 1);
   order.addCoupon(new Coupon("VALE20", 20));
   const total = order.getTotal();
   expect(total).toBe(440);
});

test("it should create a order with expired discount coupon", function () {
   const order = new Order("802.209.960-08", new Date("2022-03-01T10:00:00"));
   order.addItem(new Item(1, "Guitarra", 1000), 1);
   order.addItem(new Item(2, "Amplificador", 5000), 1);
   order.addItem(new Item(3, "Cabo", 30), 3);
   order.addCoupon(new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00")));
   const total = order.getTotal();
   expect(total).toBe(6090);
});

test("it should create a order with not expired discount coupon", function () {
   const order = new Order("802.209.960-08", new Date("2021-03-01T10:00:00"));
   order.addItem(new Item(1, "Guitarra", 1000), 1);
   order.addItem(new Item(2, "Amplificador", 5000), 1);
   order.addItem(new Item(3, "Cabo", 30), 3);
   order.addCoupon(new Coupon("VALE20", 20, new Date("2022-03-01T10:00:00")));
   const total = order.getTotal();
   expect(total).toBe(4872);
});

test("it should not create a item from order with negative quantity", function () {
   const order = new Order("802.209.960-08");
   expect(() => order.addItem(new Item(1, "Guitarra", 1000), -1)).toThrow(new Error("Invalid quantity"));
});

test("it should not create a item from order with negative quantity", function () {
   const order = new Order("802.209.960-08");
   order.addItem(new Item(1, "Guitarra", 1000), 1)
   expect(() => order.addItem(new Item(1, "Guitarra", 1000), 1)).toThrow(new Error("Duplicated item"));
});

test("it should create a order with freight", function () {
   const order = new Order("802.209.960-08");
   order.addItem(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3)), 1);
   const total = order.getTotal();
   expect(total).toBe(1030);
});

test("it should create a order with code", function () {
   const order = new Order("802.209.960-08", new Date("2022-03-01T10:00:00"), 1);
   order.addItem(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10, 3)), 1);
   expect(order.getCode()).toBe("202200000001");
});

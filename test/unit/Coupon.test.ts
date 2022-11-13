import Coupon from "../../src/domain/entity/Coupon";

test("it should create a discount coupon without expiration", function () {
    const coupon = new Coupon("VALE20", 20);
    const discount = coupon.calculateDiscount(1000);
    expect(discount).toBe(200);
});

test("it should create a not expired discount coupon", function () {
    const coupon = new Coupon("VALE20", 20, new Date("2022-03-01T10:00:00"));
    const discount = coupon.calculateDiscount(1000, new Date("2021-03-01T10:00:00"));
    expect(discount).toBe(200);
});

test("it should create a expired discount coupon", function () {
    const coupon = new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00"));
    const discount = coupon.calculateDiscount(1000, new Date("2022-03-01T10:00:00"));
    expect(discount).toBe(0);
});

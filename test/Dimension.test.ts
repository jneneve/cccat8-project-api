import Dimension from "../src/domain/entity/Dimension";

test("it should calculate the volume", function () {
    const dimension = new Dimension(100, 30, 10, 3);
    expect(dimension.getVolume()).toBe(0.03);
});

test("it should not create invalid dimension", function () {
    expect(() => new Dimension(-100, -30, -10, -3)).toThrow(new Error("Invalid dimension"));
});

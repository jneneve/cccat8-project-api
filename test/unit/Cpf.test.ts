import Cpf from "../../src/domain/entity/Cpf";

const validCpfs = [
    "867.985.490-55",
    "802.209.960-08",
    "553.852.760-30"
];

test.each(validCpfs)("it should validate a cpf valid", function (validCpf) {
    const cpf = new Cpf(validCpf)
    expect(cpf).toBeDefined();
});

test("it should validate a cpf greater than 14 characters", function () {
    expect(() => new Cpf("553.852.760-300")).toThrow(new Error("Invalid cpf!"));
});

const cpfWithTheSameCharacters = [
    "111.111.111-11",
    "222.222.222-22",
    "333.333.333-33"
];

test.each(cpfWithTheSameCharacters)("it should validate a cpf with the same characters", function (cpf) {
    expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf!"));
});

test("it should validate a cpf with letters", function () {
    expect(() => new Cpf("abc")).toThrow(new Error("Invalid cpf!"));
});

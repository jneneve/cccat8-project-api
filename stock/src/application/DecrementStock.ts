import StockEntry from "../domain/entity/StockEntry";
import StockRepository from "../domain/repository/StockRepository"

export default class DecrementStock {

    constructor (readonly stockRepository: StockRepository) {
    }

    async execute (input: Input): Promise<void> {
        console.log(input);
        await this.stockRepository.save(new StockEntry(input.idItem, "out",  input.quantity)); 
    }
}

type Input = {
    idItem: number,
    quantity: number
}
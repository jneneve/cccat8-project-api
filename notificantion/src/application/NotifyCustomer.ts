export default class NotifyCustomer {

    constructor () {
    }

    async execute (): Promise<void> {
        console.log(new Date, "Notify Customer");
    }
}
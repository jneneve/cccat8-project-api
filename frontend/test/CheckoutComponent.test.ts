import { mount } from "@vue/test-utils";
import CheckoutVue from "../src/views/Checkout.vue";
import AxiosAdapter from "../src/infra/AxiosAdapter";
import CatalogHttpGateway from "../src/gateways/CatalogHttpGateway";
import CatalogGateway from "../src/gateways/CatalogGateway";
import CheckoutHttpGateway from "../src/gateways/CheckoutHttpGateway";
import Item from "../src/entities/Item";

function sleep (ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}

test("Deve testar o componente checkout", async function () {
    const httpClient = new AxiosAdapter();
    // const catalogGateway = new CatalogHttpGateway(httpClient, "http://localhost:3002");
    const catalogGateway: CatalogGateway = {
        async getItems (): Promise<Item[]> {
            return [
                new Item(1, "Guitarra", 100)
            ]
        }
    }
    const checkoutGateway = new CheckoutHttpGateway(httpClient, "http://localhost:3000");
    const wrapper = mount(CheckoutVue, {
        global: {
            provide: {
                catalogGateway,
                checkoutGateway
            }
        }
    });
    await sleep(100);
    console.log(wrapper.html());
    await wrapper.get(".item-add").trigger("click");
    await sleep(100);
    expect(wrapper.get(".order-total").text()).toBe('{\n  "total": 1030\n}');
});
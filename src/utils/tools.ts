import Orders from "../data/orders.json";
import Subscriptions from "../data/subscriptions.json";

export type Order = {
    orderId: string;
    status: string;
    eta: string | null;
    item: string;
};

export type Subscription = {
    email: string;
    plan: string;
    renewsOn: string | null;
    status: string;
};

export function lookup_order(order_id: string): Order | null {
    const orders: Order[] = Orders;

    return orders.find(order => order.orderId === order_id) || null;
}

export function lookup_subscription(email: string): Subscription | null {
    const subscriptions: Subscription[] = Subscriptions;
    
    return subscriptions.find(subscription => subscription.email === email) || null;
}
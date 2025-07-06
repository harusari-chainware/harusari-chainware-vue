import OrderDummyView from "@/features/order/views/OrderDummyView.vue";
import OrderListView from "@/features/order/views/OrderListView.vue";
import OrderDetailView from "@/features/order/views/OrderDetailView.vue";

export const orderRoutes = [
    {
        path: '/order/list',
        name: 'OrderListView',
        component: OrderListView
    },
    {
        path: '/order/register',
        name: 'OrderRegisterView',
        component: OrderDummyView
    },
    {
        path: '/order/detail',
        name: 'OrderDetailView',
        component: OrderDetailView
    },
];

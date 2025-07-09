import OrderListView from "@/features/order/views/OrderListView.vue";
import OrderDetailView from "@/features/order/views/OrderDetailView.vue";
import OrderRegisterView from "@/features/order/views/OrderRegisterView.vue";

export const orderRoutes = [
    {
        path: '/order/list',
        name: 'OrderListView',
        component: OrderListView
    },
    {
        path: '/order/register',
        name: 'OrderRegisterView',
        component: OrderRegisterView
    },
    {
        path: '/order/detail',
        name: 'OrderDetailView',
        component: OrderDetailView
    },
];

import OrderDummyView from "@/features/order/views/OrderDummyView.vue";
import OrderListView from "@/features/order/views/OrderListView.vue";

export const orderRoutes = [
    {
        path: '/order/list',
        name: 'OrderListView',
        component: OrderListView
    },
    {
        path: '/order/register',
        name: 'OrderDummy2View',
        component: OrderDummyView
    },
    {
        path: '/order/detail',
        name: 'OrderDummy3View',
        component: OrderDummyView
    },
];

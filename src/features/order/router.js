import OrderDummyView from "@/features/order/views/OrderDummyView.vue";

export const orderRoutes = [
    {
        path: '/order/list',
        name: 'OrderDummy1View',
        component: OrderDummyView
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

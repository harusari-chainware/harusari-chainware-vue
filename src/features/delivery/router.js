import DeliveryDummyView from "@/features/delivery/views/DeliveryDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const deliveryRoutes = [
    {
        path: '/delivery/list',
        name: 'DeliveryDummy1View',
        component: DeliveryDummyView
    },
];

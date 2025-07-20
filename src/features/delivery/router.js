import DeliveryListView from "@/features/delivery/views/DeliveryListView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const deliveryRoutes = [
    {
        path: '/delivery/list',
        name: 'DeliveryListView',
        component: DeliveryListView
    },
];

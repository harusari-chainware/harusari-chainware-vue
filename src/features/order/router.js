import OrderListView from "@/features/order/views/OrderListView.vue";
import OrderDetailView from "@/features/order/views/OrderDetailView.vue";
import OrderRegisterView from "@/features/order/views/OrderRegisterView.vue";

export const orderRoutes = [
    {
        path: '/order/list',
        name: 'OrderListView',
        component: OrderListView,
        meta: {
            requiresAuth: true,
            roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER']
        }
    },
    {
        path: '/order/register',
        name: 'OrderRegisterView',
        component: OrderRegisterView,
        meta: {
            requiresAuth: true,
            roles: ['FRANCHISE_MANAGER']
        }
    },
    {
        path: '/order/:orderId',
        name: 'OrderDetailView',
        component: OrderDetailView,
        props: true,
        meta: {
            requiresAuth: true,
            roles: ['GENERAL_MANAGER', 'SENIOR_MANAGER', 'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER']
        }
    },
];

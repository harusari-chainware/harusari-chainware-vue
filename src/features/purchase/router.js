export const purchaseRoutes = [
    {
        path: '/purchases/list',
        name: 'PurchaseOrderListView',
        component: () => import('@/features/purchase/views/PurchaseOrderListView.vue')
    },
    {
        path: '/purchases/detail/:purchaseOrderId',
        name: 'PurchaseOrderDetailView',
        component: () => import('@/features/purchase/views/PurchaseOrderDetailView.vue'),
        props: true
    },
];

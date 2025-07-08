export const purchaseRoutes = [
    {
        path: '/purchase/list',
        name: 'PurchaseOrderListView',
        component: () => import('@/features/purchase/views/PurchaseOrderListView.vue')
    },
    {
        path: '/purchase/detail',
        name: 'PurchaseOrderDetailView',
        component: () => import('@/features/purchase/views/PurchaseOrderDetailView.vue')
    },
];

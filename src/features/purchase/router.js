import PurchaseDummyView from "@/features/purchase/views/PurchaseDummyView.vue";

export const purchaseRoutes = [
    {
        path: '/purchase/list',
        name: 'PurchaseOrderListView',
        component: () => import('@/features/purchase/views/PurchaseOrderListView.vue')
    },
    {
        path: '/stockin/list',
        name: 'PurchaseDummy1View',
        component: PurchaseDummyView
    },
];

import PurchaseDummyView from "@/features/purchase/views/PurchaseDummyView.vue";

export const purchaseRoutes = [
    {
        path: '/purchase/list',
        name: 'PurchaseDummy1View',
        component: () => import('@/features/purchase/views/PurchaseDummyView.vue')
    },
    {
        path: '/stockin/list',
        name: 'PurchaseDummyView',
        component: PurchaseDummyView
    },
];

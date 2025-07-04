import PurchaseDummyView from "@/features/purchase/views/PurchaseDummyView.vue";

export const purchaseRoutes = [
    {
        path: '/purchase/list',
        name: 'PurchaseDummy1View',
        component: PurchaseDummyView
    },
    {
        path: '/stockin/list',
        name: 'PurchaseDummy2View',
        component: PurchaseDummyView
    },
];

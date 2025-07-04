import RequisitionDummyView from "@/features/requisition/views/RequisitionDummyView.vue";

export const requisitionRoutes = [
    {
        path: '/requisition/list',
        name: 'RequisitionDummyView',
        component: () => import('@/features/requisition/views/RequisitionDummyView.vue')
    },
    {
        path: '/requisition/register',
        name: 'Requisition1Dummy1View',
        component: RequisitionDummyView,
        meta: { requiresAuth: true }
    },
];

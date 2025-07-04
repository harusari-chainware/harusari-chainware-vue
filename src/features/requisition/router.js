import RequisitionDummyView from "@/features/requisition/views/RequisitionDummyView.vue";

export const requisitionRoutes = [
    {
        path: '/requisition/list',
        name: 'RequisitionDummyView',
        component: () => import('@/features/requisition/views/RequisitionDummyView.vue')
    },
    {
        path: '/requisition/register',
        name: 'RequisitionDummyView',
        component: RequisitionDummyView,
        meta: { requiresAuth: true }
    },
];

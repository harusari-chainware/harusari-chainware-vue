import RequisitionListView from "@/features/requisition/views/RequisitionListView.vue";

export const requisitionRoutes = [
    {
        path: '/requisition/list',
        name: 'RequisitionListView',
        component: () => import('@/features/requisition/views/RequisitionListView.vue')
    },
    {
        path: '/requisition/register',
        name: 'RequisitionDetailView',
        component: () => import('@/features/requisition/views/RequisitionDetailVeiw.vue'),
        // meta: { requiresAuth: true }
    },
];

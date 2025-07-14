export const requisitionRoutes = [
    {
        path: '/requisitions/list',
        name: 'RequisitionListView',
        component: () => import('@/features/requisition/views/RequisitionListView.vue')
    },
    {
        path: '/requisitions/detail/:requisitionId',
        name: 'RequisitionDetailView',
        component: () => import('@/features/requisition/views/RequisitionDetailView.vue'),
        props: true
    },
    {
        path: '/requisitions/register',
        name: 'RequisitionRegisterView',
        component: () => import('@/features/requisition/views/RequisitionRegisterView.vue'),
        props: true
    },
];

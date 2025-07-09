export const requisitionRoutes = [
    {
        path: '/requisition/list',
        name: 'RequisitionListView',
        component: () => import('@/features/requisition/views/RequisitionListView.vue')
    },
    {
        path: '/requisition/detail/:requisitionId',
        name: 'RequisitionDetailView',
        component: () => import('@/features/requisition/views/RequisitionDetailView.vue'),
        props: true
    },
];

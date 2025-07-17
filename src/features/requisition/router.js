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
        name: 'RequisitionRegisterCreateView',
        component: () => import('@/features/requisition/views/RequisitionRegisterView.vue'),
        props: () => ({ mode: 'create', requisitionId: null }) // mode='create'
    },
    {
        path: '/requisitions/edit/:requisitionId',
        name: 'RequisitionRegisterView',
        component: () => import('@/features/requisition/views/RequisitionRegisterView.vue'),
        props: route => ({ mode: 'edit', requisitionId: route.params.requisitionId })
    }
];

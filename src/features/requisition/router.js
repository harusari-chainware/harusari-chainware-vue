import RequisitionDummyView from "@/features/requisition/views/RequisitionDummyView.vue";

export const requisitionRoutes = [
    {
        path: '/requisition/list',
        name: 'RequisitionDummy1View',
        component: RequisitionDummyView
    },
    {
        path: '/requisition/register',
        name: 'RequisitionDummy2View',
        component: RequisitionDummyView
    },
];

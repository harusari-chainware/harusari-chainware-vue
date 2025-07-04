import DisposalDummyView from "@/features/disposal/views/DisposalDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const disposalRoutes = [
    {
        path: '/disposal/franchise/list',
        name: 'DisposalDummyView',
        component: DisposalDummyView
    },
    {
        path: '/disposal/franchise/register',
        name: 'DisposalDummyView',
        component: DisposalDummyView
    },
    {
        path: '/disposal/warehouse/list',
        name: 'DisposalDummyView',
        component: DisposalDummyView
    },
    {
        path: '/disposal/warehouse/register',
        name: 'DisposalDummyView',
        component: DisposalDummyView
    },
];

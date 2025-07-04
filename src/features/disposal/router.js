import DisposalDummyView from "@/features/disposal/views/DisposalDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const disposalRoutes = [
    {
        path: '/disposal/franchise/list',
        name: 'DisposalDummy1View',
        component: DisposalDummyView
    },
    {
        path: '/disposal/franchise/register',
        name: 'DisposalDummy2View',
        component: DisposalDummyView
    },
    {
        path: '/disposal/warehouse/list',
        name: 'DisposalDummy3View',
        component: DisposalDummyView
    },
    {
        path: '/disposal/warehouse/register',
        name: 'DisposalDummy4View',
        component: DisposalDummyView
    },
];

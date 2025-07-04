import MemberDummyView from "@/features/member/views/MemberDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const memberRoutes = [
    {
        path: '/members/list',
        name: 'MemberDummy1View',
        component: MemberDummyView
    },
    {
        path: '/members/logs',
        name: 'MemberDummy2View',
        component: MemberDummyView
    },
    {
        path: '/members/register',
        name: 'MemberDummy3View',
        component: MemberDummyView
    },
    {
        path: '/mypage/password',
        name: 'MemberDummy4View',
        component: MemberDummyView
    },
    {
        path: '/mypage/info',
        name: 'MemberDummy5View',
        component: MemberDummyView
    },
];

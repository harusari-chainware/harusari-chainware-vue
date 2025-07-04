import MemberDummyView from "@/features/member/views/MemberDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const memberRoutes = [
    {
        path: '/members/list',
        name: 'MemberDummyView',
        component: MemberDummyView
    },
    {
        path: '/members/logs',
        name: 'MemberDummyView',
        component: MemberDummyView
    },
    {
        path: '/members/register',
        name: 'MemberDummyView',
        component: MemberDummyView
    },
    {
        path: '/mypage/password',
        name: 'MemberDummyView',
        component: MemberDummyView
    },
    {
        path: '/mypage/info',
        name: 'MemberDummyView',
        component: MemberDummyView
    },
];

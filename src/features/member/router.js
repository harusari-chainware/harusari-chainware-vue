/* 사용자가 보는 routes와 view를 연결 */
import MemberListView from "@/features/member/master/views/MemberListView.vue";
import MemberDetailView from "@/features/member/master/views/MemberDetailView.vue";

export const memberRoutes = [
    {
        path: '/member/list',
        name: 'MemberList',
        component: MemberListView,
        meta: {requiresAuth: true, roles: ['MASTER']}
    },
    {
        path: '/member/:memberId',
        name: 'MemberDetailView',
        component: MemberDetailView,
        meta: {requiresAuth: true, roles: ['MASTER']}
    },
    {
        path: '/member/register',
        name: 'MemberRegister',
        // component: MemberRegisterView,
        meta: {requiresAuth: true, roles: ['MASTER']}
    },
    // {
    //     path: '/mypage/info',
    //     name: 'MemberDummy5View',
    //     component: MemberDummyView,
    //     requiresAuth: true,
    //     roles: [
    //         'MASTER', 'GENERAL_MANAGER', 'SENIOR_MANAGER',
    //         'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER', 'VENDOR_MANAGER'
    //     ]
    // },
    {
        path: '/mypage/password',
        name: 'ChangePassword',
        // component: ChangePasswordView,
        meta: {
            requiresAuth: true,
            roles: [
                'MASTER', 'GENERAL_MANAGER', 'SENIOR_MANAGER',
                'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER', 'VENDOR_MANAGER'
            ]
        }
    }
];
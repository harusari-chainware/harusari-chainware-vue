/* 사용자가 보는 routes와 view를 연결 */
import MemberListView from "@/features/member/master/views/MemberListView.vue";
import MemberDetailView from "@/features/member/master/views/MemberDetailView.vue";
import MemberRegisterView from "@/features/member/master/views/MemberRegisterView.vue";
import ChangePasswordView from "@/features/member/mypage/views/ChangePasswordView.vue";
import MyProfileView from "@/features/member/mypage/views/MyProfileView.vue";

export const memberRoutes = [
    {
        path: '/member/list',
        name: 'MemberList',
        component: MemberListView,
        meta: {requiresAuth: true, roles: ['MASTER', 'SUPER_ADMIN']}
    },
    {
        path: '/member/:memberId',
        name: 'MemberDetailView',
        component: MemberDetailView,
        meta: {requiresAuth: true, roles: ['MASTER', 'SUPER_ADMIN']}
    },
    {
        path: '/member/register',
        name: 'MemberRegister',
        component: MemberRegisterView,
        meta: {requiresAuth: true, roles: ['MASTER', 'SUPER_ADMIN']}
    },
    {
        path: '/mypage/profile',
        name: 'MyProfile',
        component: MyProfileView,
        requiresAuth: true,
        roles: [
            'MASTER', 'GENERAL_MANAGER', 'SENIOR_MANAGER',
            'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER', 'VENDOR_MANAGER', 'SUPER_ADMIN'
        ]
    },
    {
        path: '/mypage/change-password',
        name: 'ChangePassword',
        component: ChangePasswordView,
        meta: {
            requiresAuth: true,
            roles: [
                'MASTER', 'GENERAL_MANAGER', 'SENIOR_MANAGER',
                'WAREHOUSE_MANAGER', 'FRANCHISE_MANAGER', 'VENDOR_MANAGER', 'SUPER_ADMIN'
            ]
        }
    }
];
import FranchiseDummyView from "@/features/franchise/views/FranchiseDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const franchiseRoutes = [
    {
        path: '/franchise/list',
        name: 'FranchiseDummy1View',
        component: FranchiseDummyView
    },
];

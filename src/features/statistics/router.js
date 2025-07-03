import DashboardDummyView from "@/features/statistics/views/DashboardDummyView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const dashboardRoutes = [
    {
        path: '/dashboard/prediction',
        name: 'DashboardDummyView',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/accuracy',
        name: 'DashboardDummyView',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/sales',
        name: 'DashboardDummyView',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/inventory-turn',
        name: 'DashboardDummyView',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/purchase-stats',
        name: 'DashboardDummyView',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/dispose-stats',
        name: 'DashboardDummyView',
        component: DashboardDummyView
    },
];

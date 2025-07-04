import DashboardDummyView from '../statistics/views/DashboardDummyView.vue'

/* 사용자가 보는 routes와 view를 연결 */
export const dashboardRoutes = [
    {
        path: '/dashboard/prediction',
        name: 'DashboardDummy1View',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/accuracy',
        name: 'DashboardDummy2View',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/sales',
        name: 'DashboardDummy3View',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/inventory-turn',
        name: 'DashboardDummy4View',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/purchase-stats',
        name: 'DashboardDummy5View',
        component: DashboardDummyView
    },
    {
        path: '/dashboard/dispose-stats',
        name: 'DashboardDummy6View',
        component: DashboardDummyView
    },
];

import TakeBackListView from "@/features/takeback/views/TakeBackListView.vue";
import TakeBackDetailView from "@/features/takeback/views/TakeBackDetailView.vue";
import TakeBackMyListView from "@/features/takeback/views/TakeBackMyListView.vue";

export const takebackRoutes = [
    {
        path: '/takeback/list',
        name: 'TakeBackListView',
        component: TakeBackListView
    },
    {
        path: '/mytakeback/list',
        name: 'TakeBackMyListView',
        component: TakeBackMyListView
    },
    {
        path: '/takeback/detail/:id',
        name: 'TakeBackDetailView',
        component: TakeBackDetailView
    }
];

import TakeBackListView from "@/features/takeback/views/TakeBackListView.vue";
import TakeBackDetailView from "@/features/takeback/views/TakeBackDetailView.vue";

export const takebackRoutes = [
    {
        path: '/takeback/list',
        name: 'TakeBackListView',
        component: TakeBackListView
    },
    {
        path: '/takeback/detail/:id',
        name: 'TakeBackDetailView',
        component: TakeBackDetailView
    }
];

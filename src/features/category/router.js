import CategoryListView from "@/features/category/views/CategoryListView.vue";
import CategoryCreateView from "@/features/category/views/CategoryCreateView.vue"
import TopCategoryDetailView from '@/features/category/views/TopCategoryDetailView.vue'
import CategoryDetailView from '@/features/category/views/CategoryDetailView.vue'

export const categoryRoutes = [
    {
        path: '/category/list',
        name: 'CategoryListView',
        component: CategoryListView
    },
    {
        path: '/category/register',
        name: 'CategoryCreateView',
        component: CategoryCreateView
    },
    {
        path: '/category/top/:topCategoryId',
        name: 'TopCategoryDetailView',
        component: TopCategoryDetailView,
    },
    {
        path: '/category/:categoryId',
        name: 'CategoryDetailView',
        component: CategoryDetailView,
    },
];
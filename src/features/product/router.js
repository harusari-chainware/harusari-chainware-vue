import ProductListView from "@/features/product/views/ProductListView.vue";
import ProductCreateView from "@/features/product/views/ProductCreateView.vue";
import ProductDetailView from "@/features/product/views/ProductDetailView.vue";

export const productRoutes = [
    {
        path: '/product/list',
        name: 'ProductListView',
        component: ProductListView
    },
    {
        path: '/product/register',
        name: 'ProductCreateView',
        component: ProductCreateView
    },
    {
        path: '/product/:productId',
        name: 'ProductDetailView',
        component: ProductDetailView
    },
];
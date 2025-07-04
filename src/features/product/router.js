import ProductDummyView from "@/features/product/views/ProductDummyView.vue";

export const productRoutes = [
    {
        path: '/category/list',
        name: 'ProductDummy1View',
        component: ProductDummyView
    },
    {
        path: '/category/register',
        name: 'ProductDummy2View',
        component: ProductDummyView
    },
    {
        path: '/product/list',
        name: 'ProductDummy3View',
        component: ProductDummyView
    },
    {
        path: '/product/register',
        name: 'ProductDummy4View',
        component: ProductDummyView
    },
    {
        path: '/contract/list',
        name: 'ProductDummy5View',
        component: ProductDummyView
    },
    {
        path: '/contract/register',
        name: 'ProductDummy6View',
        component: ProductDummyView
    },
];
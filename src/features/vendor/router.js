import VendorListView from "@/features/vendor/views/VendorListView.vue"
import VendorDetailView from "@/features/vendor/views/VendorDetailView.vue"
// 필요시 수정 (컴포넌트 경로 및 이름)

export const vendorRoutes = [
    {
        path: '/vendor/list',
        name: 'VendorListView',
        component: VendorListView
    },
    // {
    //     path: '/vendor/register',
    //     name: 'VendorCreateView',
    //     component: VendorCreateView
    // },
    {
        path: '/vendor/:vendorId',
        name: 'VendorDetailView',
        component: VendorDetailView
    },
]

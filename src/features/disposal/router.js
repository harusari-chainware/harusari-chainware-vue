import DisposalRegisterView from "@/features/disposal/views/DisposalRegisterView.vue";
import AdminDisposalView from "@/features/disposal/views/AdminDisposalView.vue";

export const disposalRoutes = [
    {
        path: '/disposal/list',
        name: 'FranchiseDisposalListView',
        component: AdminDisposalView
    },
    {
        path: '/disposal/register',
        name: 'FranchiseDisposalRegisterView',
        component: DisposalRegisterView
    }
];

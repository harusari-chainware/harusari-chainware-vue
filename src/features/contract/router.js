import ContractListView from "@/features/contract/views/ContractListView.vue";
import ContractCreateView from "@/features/contract/views/ContractCreateView.vue";
import ContractDetailView from "@/features/contract/views/ContractDetailView.vue";

export const contractRoutes = [
    {
        path: '/contract/list',
        name: 'ContractListView',
        component: ContractListView
    },
    {
        path: '/contract/register',
        name: 'ContractCreateView',
        component: ContractCreateView
    },
    {
        path: '/contract/:contractId',
        name: 'ContractDetailView',
        component: ContractDetailView
    },
];


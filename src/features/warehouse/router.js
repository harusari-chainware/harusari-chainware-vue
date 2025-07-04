import WarehouseDummyView from "@/features/warehouse/views/WarehouseDummyView.vue";

export const warehouseRoutes = [
    {
        path: '/warehouse/list',
        name: 'WarehouseDummy1View',
        component: WarehouseDummyView
    },
    {
        path: '/warehouse/inventory/list',
        name: 'WarehouseDummy2View',
        component: WarehouseDummyView
    },
    {
        path: '/warehouse/inventory/register',
        name: 'WarehouseDummy3View',
        component: WarehouseDummyView
    },
];

import WarehouseDummyView from "@/features/warehouse/views/WarehouseDummyView.vue";
import InventoryView from "@/features/warehouse/views/InventoryView.vue";

export const warehouseRoutes = [
    {
        path: '/warehouse/list',
        name: 'WarehouseDummy1View',
        component: WarehouseDummyView
    },
    {
        path: '/warehouse/inventory/list',
        name: 'InventoryView',
        component: InventoryView
    },
    {
        path: '/warehouse/inventory/register',
        name: 'WarehouseDummy3View',
        component: WarehouseDummyView
    },
];

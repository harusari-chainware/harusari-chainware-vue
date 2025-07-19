import InventoryView from "@/features/warehouse/views/InventoryView.vue";
import InventoryWarehouseView from "@/features/warehouse/views/InventoryWarehouseView.vue";

export const warehouseRoutes = [

    {
        path: '/warehouse/inventory/list',
        name: 'InventoryView',
        component: InventoryView
    },
    {
        path: '/warehouse-manager/inventory/list',
        name: 'InventoryWarehouseView',
        component: InventoryWarehouseView
    }
];

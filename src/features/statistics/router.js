import TotalSalesStatisticsView from "@/features/statistics/views/TotalSalesStatisticsView.vue";
import PurchaseOrderStatisticsView from "@/features/statistics/views/PurchaseOrderStatisticsView.vue";
import StoreOrderStatisticsView from "@/features/statistics/views/StoreOrderStatisticsView.vue";
import PredictionComparisonStatisticsView from "@/features/statistics/views/PredictionComparisonStatisticsView.vue";
import MenuSalesStatisticsView from "@/features/statistics/views/MenuSalesStatisticsView.vue";
import InventoryTurnoverStatisticsView from "@/features/statistics/views/InventoryTurnoverStatisticsView.vue";
import DisposalStatisticsView from "@/features/statistics/views/DisposalStatisticsView.vue";
import PredictionAccuracyStatisticsView from "@/features/statistics/views/PredictionAccuracyStatisticsView.vue";

/* 사용자가 보는 routes와 view를 연결 */
export const dashboardRoutes = [
    {
        path: '/dashboard/prediction',
        name: 'PredictionComparisonStatisticsView',
        component: PredictionComparisonStatisticsView
    },
    {
        path: '/dashboard/accuracy',
        name: 'PredictionAccuracyStatisticsView',
        component: PredictionAccuracyStatisticsView
    },
    {
        path: '/dashboard/sales',
        name: 'TotalSalesStatisticsView',
        component: TotalSalesStatisticsView
    },{
        path: '/dashboard/menu-sales',
        name: 'MenuSalesStatisticsView',
        component: MenuSalesStatisticsView
    },
    {
        path: '/dashboard/inventory-turn',
        name: 'InventoryTurnoverStatisticsView',
        component: InventoryTurnoverStatisticsView
    },
    {
        path: '/dashboard/purchase-stats',
        name: 'PurchaseOrderStatistics',
        component: PurchaseOrderStatisticsView,
    },
    {
        path: '/dashboard/dispose-stats',
        name: 'DisposalStatisticsView',
        component: DisposalStatisticsView
    },
    {
        path: '/dashboard/store-order-stats',
        name: 'StoreOrderStatisticsView',
        component: StoreOrderStatisticsView
    }
];

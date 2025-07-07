import { createRouter, createWebHistory } from 'vue-router'

import LayoutDefault from '/src/components/layout/LayoutDefault.vue'

import { categoryRoutes } from "@/features/category/router.js";
import { contractRoutes } from "@/features/contract/router.js";
import { deliveryRoutes } from "@/features/delivery/router.js";
import { disposalRoutes } from "@/features/disposal/router.js";
import { franchiseRoutes } from "@/features/franchise/router.js";
import { memberRoutes } from "@/features/member/router.js";
import { orderRoutes } from "@/features/order/router.js";
import { productRoutes } from "@/features/product/router.js";
import { purchaseRoutes } from "@/features/purchase/router.js";
import { requisitionRoutes } from "@/features/requisition/router.js";
import { dashboardRoutes } from "@/features/statistics/router.js";
import { takebackRoutes } from "@/features/takeback/router.js";
import { vendorRoutes } from "@/features/vendor/router.js";
import { warehouseRoutes } from "@/features/warehouse/router.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LayoutDefault,
      children: [
          {
              path: '',
              redirect: '/dashboard/prediction' // 기본 페이지
          },
          ...categoryRoutes,
          ...contractRoutes,
          ...deliveryRoutes,
          ...disposalRoutes,
          ...franchiseRoutes,
          ...memberRoutes,
          ...orderRoutes,
          ...productRoutes,
          ...purchaseRoutes,
          ...requisitionRoutes,
          ...dashboardRoutes,
          ...takebackRoutes,
          ...vendorRoutes,
          ...warehouseRoutes
      ]
    }
  ],
})

export default router
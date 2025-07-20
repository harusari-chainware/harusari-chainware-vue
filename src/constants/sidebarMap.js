export const sidebarMap = {
    "회원": [
        {
            title: "회원",
            icon: 'fas fa-users',
            items: [
                { name: "회원 조회", route: "/member/list", icon: "fas fa-magnifying-glass", roles: ["MASTER", "SUPER_ADMIN"] },
                { name: "회원 등록", route: "/member/register", icon: "fas fa-user-plus", roles: ["MASTER", "SUPER_ADMIN"] }
            ]
        }
    ],
    "제품": [
        {
            title: "카테고리",
            icon: 'fas fa-folder-tree',
            items: [
                { name: "카테고리 조회", route: "/category/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "SUPER_ADMIN"] },
                { name: "카테고리 등록", route: "/category/register", icon: "fas fa-plus", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        {
            title: "제품",
            icon: 'fas fa-cube',
            items: [
                { name: "제품 조회", route: "/product/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "SUPER_ADMIN"] },
                { name: "제품 등록", route: "/product/register", icon: "fas fa-plus", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        {
            title: "계약",
            icon: 'fas fa-file-contract',
            items: [
                { name: "거래처 별 제품 계약 조회", route: "/contract/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "VENDOR_MANAGER", "SUPER_ADMIN"] },
                { name: "거래처 별 제품 계약 등록", route: "/contract/register", icon: "fas fa-file-circle-plus", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] }
            ]
        }
    ],
    "거래처/창고": [
        // {
        //     title: "가맹점",
        //     icon: 'fas fa-shop',
        //     items: [
        //         { name: "가맹점 조회", route: "/franchise/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN", "FRANCHISE_MANAGER"] }
        //     ]
        // },
        {
            title: "거래처",
            icon: 'fas fa-building',
            items: [
                { name: "거래처 조회", route: "/vendor/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN", "VENDOR_MANAGER"] }
            ]
        },
        {
            title: "창고",
            icon: 'fas fa-warehouse',
            items: [
                { name: "보유 재고 조회", route: "/warehouse/inventory/list", icon: "fas fa-cubes-stacked", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "보유 재고 조회", route: "/warehouse-manager/inventory/list", icon: "fas fa-cubes-stacked", roles: ["WAREHOUSE_MANAGER", "SUPER_ADMIN"] },
                { name: "보유 재고 등록", route: "/warehouse/inventory/register", icon: "fas fa-plus", roles: ["WAREHOUSE_MANAGER", "SUPER_ADMIN"] }
            ]
        }
    ],
    "주문/반품": [
        {
            title: "주문",
            icon: 'fas fa-receipt',
            items: [
                { name: "주문 조회", route: "/order/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "SUPER_ADMIN"] },
                { name: "주문 등록", route: "/order/register", icon: "fas fa-cart-plus", roles: ["FRANCHISE_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        {
            title: "반품",
            icon: 'fas fa-arrows-rotate',
            items: [
                { name: "반품 조회", route: "/takeback/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "FRANCHISE_MANAGER", "SUPER_ADMIN"] },
                { name: "반품 조회", route: "/mytakeback/list", icon: "fas fa-magnifying-glass", roles: [ "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        // {
        //     title: "배송",
        //     icon: 'fas fa-truck',
        //     items: [
        //         { name: "배송 조회", route: "/delivery/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "SUPER_ADMIN"] }
        //     ]
        // }
    ],
    "품의/발주": [
        {
            title: "품의",
            icon: 'fas fa-signature',
            items: [
                { name: "품의 조회", route: "/requisitions/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "품의 등록", route: "/requisitions/register", icon: "fas fa-file-circle-plus", roles: ["GENERAL_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        {
            title: "발주",
            icon: 'fas fa-cart-shopping',
            items: [
                { name: "발주 조회", route: "/purchases/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "VENDOR_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        // {
        //     title: "입고",
        //     icon: 'fas fa-trailer',
        //     items: [
        //         { name: "입고 조회", route: "/stockin/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "SUPER_ADMIN"] }
        //     ]
        // }
    ],
    "폐기": [
        {
            title: "폐기",
            icon: 'fas fa-trash-can',
            items: [
                { name: "폐기 조회", route: "/disposal/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN" /*, "FRANCHISE_MANAGER" */] },
                { name: "폐기 등록", route: "/disposal/register", icon: "fas fa-plus", roles: ["FRANCHISE_MANAGER", "WAREHOUSE_MANAGER", "SUPER_ADMIN"] }
            ]
        } //,
        // {
        //     title: "창고 폐기",
        //     icon: 'fas fa-dumpster',
        //     items: [
        //         { name: "창고 폐기 조회", route: "/disposal/warehouse/list", icon: "fas fa-magnifying-glass", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER"] },
        //         { name: "창고 폐기 등록", route: "/disposal/warehouse/register", icon: "fas fa-plus", roles: ["WAREHOUSE_MANAGER"] }
        //     ]
        // }
    ],
    "대시보드": [
        {
            title: "예측",
            icon: 'fas fa-chart-line',
            items: [
                { name: "예측 종합 조회", route: "/dashboard/prediction", icon: "fas fa-chart-line", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "예측 정확도 조회", route: "/dashboard/accuracy", icon: "fas fa-bullseye", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] }
            ]
        },
        {
            title: "통계",
            icon: 'fas fa-chart-pie',
            items: [
                { name: "판매 및 매출 패턴 조회", route: "/dashboard/sales", icon: "fas fa-chart-bar", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "재고 회전율 조회", route: "/dashboard/inventory-turn", icon: "fas fa-sync-alt", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "발주량 통계 조회", route: "/dashboard/purchase-stats", icon: "fas fa-chart-area", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "폐기율 통계 조회", route: "/dashboard/dispose-stats", icon: "fas fa-trash-alt", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "메뉴 별 판매량 조회", route: "/dashboard/menu-sales",  icon: "fas fa-utensils", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
                { name: "주문량 통계 조회", route: "/dashboard/store-order-stats", icon: "fas fa-shopping-cart", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "SUPER_ADMIN"] },
            ]
        }
    ],
    "마이페이지": [
        {
            title: "마이페이지",
            icon: 'fas fa-circle-user',
            items: [
                { name: "회원 정보 조회", route: "/mypage/profile", icon: "fas fa-id-card", roles: ["MASTER", "GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "VENDOR_MANAGER", "SYSTEM", "SUPER_ADMIN"] },
                { name: "비밀번호 변경", route: "/mypage/change-password", icon: "fas fa-key", roles: ["MASTER", "GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "VENDOR_MANAGER", "SYSTEM", "SUPER_ADMIN"] }
            ]
        }
    ]
};

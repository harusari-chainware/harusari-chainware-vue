export const sidebarMap = {
    "회원": [
        {
            title: "회원",
            icon: 'fas fa-user-plus',
            items: [
                { name: "회원 조회", route: "/members/list", roles: ["MASTER"] },
                { name: "로그인 내역 조회", route: "/members/logs", roles: ["MASTER"] },
                { name: "신규 회원 가입", route: "/members/register", roles: ["MASTER"] }
            ]
        }
    ],
    "제품": [
        {
            title: "카테고리",
            icon: 'fas fa-folder-tree',
            items: [
                { name: "카테고리 조회", route: "/category/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER"] },
                { name: "카테고리 등록", route: "/category/register", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        },
        {
            title: "제품",
            icon: 'fas fa-cube',
            items: [
                { name: "제품 조회", route: "/product/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER"] },
                { name: "제품 등록", route: "/product/register", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        },
        {
            title: "계약",
            icon: 'fas fa-file-contract',
            items: [
                { name: "거래처 별 제품 계약 조회", route: "/contract/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "VENDOR_MANAGER"] },
                { name: "거래처 별 제품 계약 등록", route: "/contract/register", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        }
    ],
    "가맹점/거래처/창고": [
        {
            title: "가맹점",
            icon: 'fas fa-shop',
            items: [
                { name: "가맹점 조회", route: "/franchise/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        },
        {
            title: "거래처",
            icon: 'fas fa-building',
            items: [
                { name: "거래처 조회", route: "/vendor/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        },
        {
            title: "창고",
            icon: 'fas fa-warehouse',
            items: [
                { name: "창고 조회", route: "/warehouse/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER"] },
                { name: "보유 재고 조회", route: "/warehouse/inventory/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER"] },
                { name: "보유 재고 등록", route: "/warehouse/inventory/register", roles: ["WAREHOUSE_MANAGER"] }
            ]
        }
    ],
    "주문/반품/배송": [
        {
            title: "주문",
            icon: 'fas fa-receipt',
            items: [
                { name: "주문 조회", route: "/order/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER"] },
                { name: "주문 등록", route: "/order/register", roles: ["FRANCHISE_MANAGER"] }
            ]
        },
        {
            title: "반품",
            icon: 'fas fa-arrows-rotate',
            items: [
                { name: "반품 조회", route: "/takeback/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER"] }
            ]
        },
        {
            title: "배송",
            icon: 'fas fa-truck',
            items: [
                { name: "배송 조회", route: "/delivery/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER"] }
            ]
        }
    ],
    "품의/발주/입고": [
        {
            title: "품의",
            icon: 'fas fa-signature',
            items: [
                { name: "품의 조회", route: "/requisition/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] },
                { name: "품의 등록", route: "/requisition/register", roles: ["GENERAL_MANAGER"] }
            ]
        },
        {
            title: "발주",
            icon: 'fas fa-cart-shopping',
            items: [
                { name: "발주 조회", route: "/purchase/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "VENDOR_MANAGER"] }
            ]
        },
        {
            title: "입고",
            icon: 'fas fa-trailer',
            items: [
                { name: "입고 조회", route: "/stockin/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER"] }
            ]
        }
    ],
    "폐기": [
        {
            title: "가맹점 폐기",
            icon: 'fas fa-trash-can',
            items: [
                { name: "가맹점 폐기 조회", route: "/disposal/franchise/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "FRANCHISE_MANAGER"] },
                { name: "가맹점 폐기 등록", route: "/disposal/franchise/register", roles: ["FRANCHISE_MANAGER"] }
            ]
        },
        {
            title: "창고 폐기",
            icon: 'fas fa-dumpster',
            items: [
                { name: "창고 폐기 조회", route: "/disposal/warehouse/list", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER"] },
                { name: "창고 폐기 등록", route: "/disposal/warehouse/register", roles: ["WAREHOUSE_MANAGER"] }
            ]
        }
    ],
    "대시보드": [
        {
            title: "예측",
            icon: 'fas fa-chart-line',
            items: [
                { name: "예측 종합 조회", route: "/dashboard/prediction", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] },
                { name: "예측 정확도 조회", route: "/dashboard/accuracy", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        },
        {
            title: "통계",
            icon: 'fas fa-chart-pie',
            items: [
                { name: "판매 및 매출 패턴 조회", route: "/dashboard/sales", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] },
                { name: "재고 회전율 조회", route: "/dashboard/inventory-turn", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] },
                { name: "발주량 통계 조회", route: "/dashboard/purchase-stats", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] },
                { name: "폐기율 통계 조회", route: "/dashboard/dispose-stats", roles: ["GENERAL_MANAGER", "SENIOR_MANAGER"] }
            ]
        }
    ],
    "마이페이지": [
        {
            title: "마이페이지",
            icon: 'fas fa-circle-user',
            items: [
                { name: "비밀번호 변경", route: "/mypage/password", roles: ["MASTER", "GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "VENDOR_MANAGER", "SYSTEM"] },
                { name: "회원 정보 조회", route: "/mypage/info", roles: ["MASTER", "GENERAL_MANAGER", "SENIOR_MANAGER", "WAREHOUSE_MANAGER", "FRANCHISE_MANAGER", "VENDOR_MANAGER", "SYSTEM"] }
            ]
        }
    ]
};

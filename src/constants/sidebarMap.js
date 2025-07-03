export const sidebarMap = {
    "회원": [
        {
            title: "회원",
            icon: 'fas fa-user-plus',
            items: [
                { name: "회원 조회", route: "/members/list" },
                { name: "로그인 내역 조회", route: "/members/logs" },
                { name: "신규 회원 가입", route: "/members/register" }
            ]
        }
    ],
    "제품": [
        {
            title: "카테고리",
            icon: 'fas fa-file-lines',
            items: [
                { name: "카테고리 조회", route: "/category/list", roles: ["admin", "franchise"] },
                { name: "카테고리 등록", route: "/category/register", roles: ["admin"] }
            ]
        },
        {
            title: "제품",
            icon: 'fas fa-file-lines',
            items: [
                { name: "제품 조회", route: "/product/list", roles: ["admin", "franchise"] },
                { name: "제품 등록", route: "/product/register", roles: ["admin"] }
            ]
        },
        {
            title: "계약",
            icon: 'fas fa-file-lines',
            items: [
                { name: "거래처 별 제품 계약 조회", route: "/contract/list", roles: ["admin", "franchise", "vendor"] },
                { name: "거래처 별 제품 계약 등록", route: "/contract/register", roles: ["admin"] }
            ]
        }
    ],
    "가맹점/거래처/창고": [
        {
            title: "가맹점",
            icon: 'fas fa-file-lines',
            items: [
                { name: "가맹점 조회", route: "/franchise/list" },
                { name: "가맹점 등록", route: "/franchise/register" }
            ]
        },
        {
            title: "거래처",
            icon: 'fas fa-file-lines',
            items: [
                { name: "거래처 조회", route: "/vendor/list" },
                { name: "거래처 등록", route: "/vendor/register" }
            ]
        },
        {
            title: "창고",
            icon: 'fas fa-warehouse',
            items: [
                { name: "창고 조회", route: "/warehouse/list" },
                { name: "창고 등록", route: "/warehouse/register" }
            ]
        }
    ],
    "주문/반품/배송": [
        {
            title: "주문",
            icon: 'fas fa-file-lines',
            items: [
                { name: "주문 조회", route: "/order/list" },
                { name: "주문 등록", route: "/order/register" }
            ]
        },
        {
            title: "반품",
            icon: 'fas fa-file-lines',
            items: [
                { name: "반품 조회", route: "/takeback/list" }
            ]
        },
        {
            title: "배송",
            icon: 'fas fa-file-lines',
            items: [
                { name: "배송 조회", route: "/delivery/list" }
            ]
        }
    ],
    "품의/발주/입고": [
        {
            title: "품의",
            icon: 'fas fa-file-lines',
            items: [
                { name: "품의 조회", route: "/requisition/list" },
                { name: "품의 등록", route: "/requisition/register" }
            ]
        },
        {
            title: "발주",
            icon: 'fas fa-file-lines',
            items: [
                { name: "발주 조회", route: "/purchase/list" }
            ]
        },
        {
            title: "입고",
            icon: 'fas fa-file-lines',
            items: [
                { name: "입고 조회", route: "/stockin/list" }
            ]
        }
    ],
    "폐기": [
        {
            title: "가맹점 폐기",
            icon: 'fas fa-file-lines',
            items: [
                { name: "가맹점 폐기 조회", route: "/franchise/dispose/list" },
                { name: "가맹점 폐기 등록", route: "/franchise/dispose/register" }
            ]
        },
        {
            title: "창고 폐기",
            icon: 'fas fa-file-lines',
            items: [
                { name: "창고 폐기 조회", route: "/warehouse/dispose/list" },
                { name: "창고 폐기 등록", route: "/warehouse/dispose/register" }
            ]
        }
    ],
    "대시보드": [
        {
            title: "예측",
            icon: 'fas fa-file-lines',
            items: [
                { name: "예측 종합 조회", route: "/dashboard/prediction" },
                { name: "예측 정확도 조회", route: "/dashboard/accuracy" }
            ]
        },
        {
            title: "통계",
            icon: 'fas fa-file-lines',
            items: [
                { name: "판매 및 매출 패턴 조회", route: "/dashboard/sales" },
                { name: "재고 회전율 조회", route: "/dashboard/inventory-turn" },
                { name: "발주량 통계 조회", route: "/dashboard/purchase-stats" },
                { name: "폐기율 통계 조회", route: "/dashboard/dispose-stats" }
            ]
        }
    ],
    "마이페이지": [
        {
            title: "마이페이지",
            icon: 'fas fa-file-lines',
            items: [
                { name: "비밀번호 변경", route: "/mypage/password" },
                { name: "회원 정보 조회", route: "/mypage/info" }
            ]
        }
    ]
}

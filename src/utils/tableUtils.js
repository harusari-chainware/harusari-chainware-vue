export const formatCurrency = (value) => {
    if (typeof value !== 'number') return '-';
    return `${value.toLocaleString()}원`;
};

export const statusText = (status) => {
    return {
        PENDING: '승인 대기중',
        APPROVED: '승인됨',
        REJECTED: '반려됨',
        DELIVERED: '완료'
    }[status] || status;
};

export const statusClass = (status) => {
    return {
        PENDING: 'status-pending',
        APPROVED: 'status-approved',
        REJECTED: 'status-rejected',
        DELIVERED: 'status-approved'
    }[status] || '';
};
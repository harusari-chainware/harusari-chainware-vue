export const formatCurrency = (value) => {
    if (typeof value !== 'number') return '-';
    return `${value.toLocaleString()}원`;
};

// 개수
export const formatAmount = (value) => {
    if (typeof value !== 'number') return '-';
    return `${value.toLocaleString()}개`;
};

//  날짜 (yyyy-MM-dd) 포맷
export const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
};

// 날짜 + 시간 (yyyy-MM-dd HH:mm) 포맷
export const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return `${date.toISOString().split('T')[0]} ${date.toTimeString().slice(0, 5)}`; // yyyy-MM-dd HH:mm
};
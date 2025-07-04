export const formatCurrency = (value) => {
    if (typeof value !== 'number') return '-';
    return `${value.toLocaleString()}원`;
};
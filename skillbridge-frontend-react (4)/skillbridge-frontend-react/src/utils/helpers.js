export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(date)
  );
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const statusLabel = (status) => {
  const map = {
    open: 'متاح',
    in_progress: 'جاري التنفيذ',
    submitted: 'تم التسليم',
    completed: 'مكتمل',
    disputed: 'فيه نزاع',
    cancelled: 'ملغي',
  };
  return map[status] || status;
};

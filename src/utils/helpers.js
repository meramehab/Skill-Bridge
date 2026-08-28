import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export const helpers = {
  formatDate(date, formatStr = 'dd MMMM yyyy') {
    return format(new Date(date), formatStr, { locale: ar })
  },

  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  },

  generateId() {
    return Math.random().toString(36).substring(2, 15)
  },

  calculateProgress(current, total) {
    if (total === 0) return 0
    return Math.round((current / total) * 100)
  },

  getLevel(score) {
    if (score >= 90) return { label: 'خبير', color: 'text-purple-500' }
    if (score >= 70) return { label: 'متقدم', color: 'text-primary' }
    if (score >= 50) return { label: 'متوسط', color: 'text-warning' }
    return { label: 'مبتدئ', color: 'text-gray-500' }
  },

  // ✅ أضف الدوال دي
  getStatusColor(status) {
    const colors = {
      'active': 'text-green-500',
      'in_progress': 'text-yellow-500',
      'completed': 'text-blue-500',
      'cancelled': 'text-red-500',
    }
    return colors[status] || 'text-gray-500'
  },

  getStatusBadge(status) {
    const badges = {
      'active': 'bg-green-100 text-green-700',
      'in_progress': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-blue-100 text-blue-700',
      'cancelled': 'bg-red-100 text-red-700',
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  },

  getStatusText(status) {
    const texts = {
      'active': 'نشط',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
    }
    return texts[status] || status
  },
}
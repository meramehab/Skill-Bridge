<template>
  <div class="container-custom py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">لوحة تحكم الإدارة</h1>
        <p class="text-gray-600">مراقبة وإدارة جميع جوانب المنصة</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <button class="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primaryDark">
          تصدير تقرير
        </button>
        <button class="bg-success text-white px-4 py-2 rounded-xl text-sm hover:bg-green-600">
          إضافة مسؤول
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in adminStats" :key="stat.label" class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
        <div class="flex items-center justify-between">
          <component :is="stat.icon" :class="stat.iconClass" />
          <span class="text-xs text-gray-500">{{ stat.label }}</span>
        </div>
        <p class="text-2xl font-bold mt-2">{{ stat.value }}</p>
        <p class="text-xs" :class="stat.changeColor">{{ stat.change }}</p>
      </div>
    </div>

    <!-- Recent Activity & Disputes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Activity -->
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-xl font-bold mb-4">النشاطات الأخيرة</h2>
        <div v-for="activity in recentActivities" :key="activity.id" class="border-b py-3 last:border-0 flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ activity.user }}</p>
            <p class="text-sm text-gray-600">{{ activity.action }}</p>
          </div>
          <span class="text-xs text-gray-500">{{ activity.time }}</span>
        </div>
      </div>

      <!-- Disputes -->
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-yellow-600">النزاعات النشطة</h2>
        <div v-for="dispute in disputes" :key="dispute.id" class="border-b py-3 last:border-0">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">{{ dispute.title }}</p>
              <p class="text-sm text-gray-600">{{ dispute.between }}</p>
            </div>
            <button class="text-primary text-sm hover:underline">تحكيم</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <router-link to="/admin/users" class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center">
        <UsersIcon class="w-6 h-6 text-primary mx-auto mb-2" />
        <p class="text-sm font-semibold">إدارة المستخدمين</p>
      </router-link>
      <router-link to="/admin/projects" class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center">
        <FolderKanbanIcon class="w-6 h-6 text-blue-500 mx-auto mb-2" />
        <p class="text-sm font-semibold">إدارة المشاريع</p>
      </router-link>
      <router-link to="/admin/universities" class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center">
        <GraduationCapIcon class="w-6 h-6 text-green-500 mx-auto mb-2" />
        <p class="text-sm font-semibold">إدارة الجامعات</p>
      </router-link>
      <router-link to="/admin/analytics" class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center">
        <ChartIcon class="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p class="text-sm font-semibold">الإحصائيات</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Users, FolderKanban, GraduationCap, ChartBar, AlertTriangle, Clock } from 'lucide-vue-next'

const adminStats = ref([
  { icon: Users, iconClass: 'text-2xl text-primary', value: '1,250', label: 'مستخدمين', change: '+450 نشط', changeColor: 'text-green-600' },
  { icon: FolderKanban, iconClass: 'text-2xl text-blue-500', value: '320', label: 'مشاريع', change: '85 نشطة', changeColor: 'text-blue-600' },
  { icon: ChartBar, iconClass: 'text-2xl text-green-500', value: '$42,500', label: 'إيرادات', change: '+12% هذا الشهر', changeColor: 'text-green-600' },
  { icon: AlertTriangle, iconClass: 'text-2xl text-yellow-500', value: '12', label: 'نزاعات', change: 'بانتظار التحكيم', changeColor: 'text-yellow-600' },
])

const recentActivities = ref([
  { id: 1, user: 'أحمد محمد', action: 'سجل جديد', time: 'منذ 5 دقائق' },
  { id: 2, user: 'سارة علي', action: 'أنشأت مشروع جديد', time: 'منذ 15 دقيقة' },
  { id: 3, user: 'محمد خالد', action: 'طلب توثيق حساب', time: 'منذ ساعة' },
  { id: 4, user: 'نورة أحمد', action: 'نزاع على مشروع #123', time: 'منذ ساعتين' },
])

const disputes = ref([
  { id: 1, title: 'نزاع المشروع #1001', between: 'بين أحمد وسارة' },
  { id: 2, title: 'نزاع المشروع #1002', between: 'بين محمد ونورة' },
  { id: 3, title: 'نزاع المشروع #1003', between: 'بين خالد وفاطمة' },
])
</script>
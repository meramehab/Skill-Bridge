<template>
  <div class="container-custom py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">مرحباً، {{ user?.name || 'أحمد' }} 👋</h1>
        <p class="text-gray-600">إليك ملخص نشاطك على المنصة</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <router-link to="/learning" class="btn-primary text-sm">
          أكمل التعلم
        </router-link>
        <router-link to="/marketplace" class="btn-secondary text-sm">
          ابحث عن فرص
        </router-link>
      </div>
    </div>

    <!-- Career Readiness Score -->
    <div class="bg-gradient-primary rounded-2xl p-6 mb-8 text-white">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <h3 class="text-sm opacity-90">مؤشر الجاهزية</h3>
          <p class="text-4xl font-bold">{{ readinessScore }}%</p>
        </div>
        <div class="flex-1">
          <div class="w-full bg-white/20 rounded-full h-3">
            <div class="bg-white h-3 rounded-full transition-all" :style="{ width: readinessScore + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs opacity-80 mt-1">
            <span>مبتدئ</span>
            <span>متوسط</span>
            <span>متقدم</span>
            <span>خبير</span>
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm">{{ verifiedSkills }} مهارات موثّقة</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
        <div class="flex items-center justify-between">
          <component :is="stat.icon" :class="stat.iconClass" />
          <span class="text-xs text-gray-500">{{ stat.label }}</span>
        </div>
        <p class="text-2xl font-bold mt-2">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Projects -->
    <div class="bg-white rounded-2xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">مشاريعي النشطة</h2>
        <router-link to="/student/projects" class="text-primary text-sm hover:underline">
          عرض الكل →
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>

      <div v-else-if="projects.length === 0" class="text-center py-8 text-gray-500">
        <p>لا توجد مشاريع نشطة حالياً</p>
        <router-link to="/marketplace" class="text-primary hover:underline text-sm">
          ابحث عن فرص عمل
        </router-link>
      </div>

      <div v-else v-for="project in projects" :key="project.id" class="border-b py-4 last:border-0">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold">{{ project.title }}</h3>
            <p class="text-sm text-gray-600">العميل: {{ project.client }}</p>
          </div>
          <span class="text-sm text-primary font-semibold">{{ project.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="bg-primary h-2 rounded-full transition-all" :style="{ width: project.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useProjectsStore } from '@/store/projects'
import { useSkillsStore } from '@/store/skills'
import { FolderKanban, CheckCircle, Star, Clock } from 'lucide-vue-next'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const skillsStore = useSkillsStore()

const user = computed(() => authStore.user)
const projects = computed(() => projectsStore.activeProjects)
const loading = computed(() => projectsStore.isLoading)
const verifiedSkills = computed(() => skillsStore.verifiedSkills.length)
const readinessScore = computed(() => skillsStore.careerReadinessScore)

const stats = computed(() => [
  { icon: FolderKanban, iconClass: 'text-2xl text-primary', value: projects.value.length || 0, label: 'نشطة' },
  { icon: CheckCircle, iconClass: 'text-2xl text-success', value: '12', label: 'مكتملة' },
  { icon: Star, iconClass: 'text-2xl text-yellow-500', value: '4.8', label: 'سمعة' },
  { icon: Clock, iconClass: 'text-2xl text-blue-500', value: '120', label: 'ساعة' },
])

onMounted(async () => {
  await projectsStore.fetchProjects()
  await skillsStore.calculateReadinessScore()
})
</script>
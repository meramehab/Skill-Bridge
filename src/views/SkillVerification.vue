<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-2 text-center">تقييم المهارات</h1>
      <p class="text-gray-600 text-center mb-8">أثبت كفاءتك في المهارات التقنية من خلال الاختبارات العملية</p>

      <!-- Select Skill -->
      <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">اختر المهارة</label>
        <select v-model="selectedSkill" class="input-field">
          <option value="">-- اختر مهارة --</option>
          <option v-for="skill in availableSkills" :key="skill.id" :value="skill.id">
            {{ skill.name }}
          </option>
        </select>
      </div>

      <!-- Assessment Type -->
      <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h3 class="font-bold mb-4">اختر نوع التقييم</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="type in assessmentTypes"
            :key="type.id"
            @click="selectedType = type.id"
            class="p-4 border-2 rounded-xl text-center transition"
            :class="selectedType === type.id ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary'"
          >
            <div class="text-3xl mb-2">{{ type.icon }}</div>
            <p class="font-semibold">{{ type.name }}</p>
            <p class="text-xs text-gray-500">{{ type.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Start Assessment -->
      <button
        @click="startAssessment"
        :disabled="!selectedSkill || !selectedType || isLoading"
        class="w-full btn-primary text-lg"
      >
        <span v-if="isLoading">جاري التحميل...</span>
        <span v-else>ابدأ التقييم</span>
      </button>

      <!-- Results -->
      <div v-if="result" class="bg-white rounded-2xl shadow p-6 mt-6">
        <h3 class="text-xl font-bold mb-4">نتيجة التقييم</h3>
        <div class="flex items-center gap-6">
          <div class="text-center">
            <p class="text-4xl font-bold text-primary">{{ result.score }}%</p>
            <p class="text-sm text-gray-500">النتيجة</p>
          </div>
          <div class="flex-1">
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-primary h-3 rounded-full" :style="{ width: result.score + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>مبتدئ</span>
              <span>{{ result.level }}</span>
              <span>خبير</span>
            </div>
          </div>
          <div class="text-center">
            <p class="text-2xl">{{ result.passed ? '✅' : '❌' }}</p>
            <p class="text-sm text-gray-500">{{ result.passed ? 'اجتاز' : 'لم يجتز' }}</p>
          </div>
        </div>
        <div v-if="result.feedback" class="mt-4 p-4 bg-gray-50 rounded-xl">
          <p class="text-sm text-gray-600">{{ result.feedback }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSkillsStore } from '@/store/skills'
import { useAI } from '@/composables/useAI'

const skillsStore = useSkillsStore()
const { verifySkill, isLoading } = useAI()

const selectedSkill = ref('')
const selectedType = ref('quiz')
const result = ref(null)

const availableSkills = ref([
  { id: 1, name: 'React.js' },
  { id: 2, name: 'Vue.js' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'Node.js' },
  { id: 5, name: 'JavaScript' },
])

const assessmentTypes = [
  { id: 'quiz', icon: '📝', name: 'اختبار', desc: 'أسئلة متعددة الاختيار' },
  { id: 'task', icon: '💻', name: 'مهمة عملية', desc: 'تطبيق عملي' },
  { id: 'project', icon: '📁', name: 'مراجعة مشروع', desc: 'تحليل كود' },
]

const startAssessment = async () => {
  const skill = availableSkills.value.find(s => s.id === selectedSkill.value)
  const type = assessmentTypes.find(t => t.id === selectedType.value)

 
  isLoading.value = true
  setTimeout(() => {
    result.value = {
      score: Math.floor(Math.random() * 30) + 70,
      level: 'متقدم',
      passed: true,
      feedback: 'أداء ممتاز! أتقنت المهارات الأساسية والمتقدمة.',
    }
    isLoading.value = false
  }, 2000)
}
</script>
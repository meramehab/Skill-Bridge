<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">📄 تحليل السيرة الذاتية</h1>
        <p class="text-gray-600">
          ارفع سيرتك الذاتية وسيحللها الذكاء الاصطناعي لتحديد مستوى مهاراتك
        </p>
      </div>

      <!-- Upload Section -->
      <div class="bg-white rounded-2xl shadow p-8 mb-6">
        <div
          class="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary transition cursor-pointer"
          :class="{ 'border-primary bg-primary/5': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="$refs.fileInput.click()"
        >
          <div class="text-6xl mb-4">📤</div>
          <h3 class="text-xl font-semibold mb-2">ارفع السيرة الذاتية</h3>
          <p class="text-gray-500 text-sm mb-4">
            اسحب الملف هنا أو اضغط للاختيار
          </p>
          <p class="text-xs text-gray-400">
            يدعم: PDF, DOCX, DOC (حد أقصى 5MB)
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.docx,.doc"
            class="hidden"
            @change="handleFileUpload"
          />
        </div>

        <!-- Selected File -->
        <div v-if="selectedFile" class="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">📎</span>
            <div>
              <p class="font-semibold">{{ selectedFile.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button @click="clearFile" class="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>

        <!-- Analyze Button -->
        <button
          @click="analyzeCV"
          :disabled="!selectedFile || isLoading"
          class="w-full mt-6 btn-primary text-lg"
        >
          <span v-if="isLoading">
            <span class="inline-block animate-spin ml-2">⏳</span>
            جاري التحليل...
          </span>
          <span v-else>🚀 تحليل السيرة الذاتية</span>
        </button>
      </div>

      <!-- Results -->
      <div v-if="results" class="space-y-6">
        <!-- Score -->
        <div class="bg-white rounded-2xl shadow p-6">
          <h3 class="text-xl font-bold mb-4">نتيجة التحليل</h3>
          <div class="flex items-center gap-6">
            <div class="text-center">
              <p class="text-5xl font-bold text-primary">{{ results.score }}%</p>
              <p class="text-sm text-gray-500">مؤشر الجاهزية</p>
            </div>
            <div class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-primary h-3 rounded-full transition-all" :style="{ width: results.score + '%' }"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>مبتدئ</span>
                <span>{{ results.level }}</span>
                <span>خبير</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="bg-white rounded-2xl shadow p-6">
          <h3 class="text-xl font-bold mb-4">🛠️ المهارات المكتشفة</h3>
          <div class="space-y-3">
            <div v-for="skill in results.skills" :key="skill.name" class="border-b pb-3 last:border-0">
              <div class="flex justify-between items-center">
                <span class="font-semibold">{{ skill.name }}</span>
                <span class="text-sm" :class="getLevelColor(skill.level)">
                  {{ skill.level }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div class="h-1.5 rounded-full bg-primary" :style="{ width: skill.score + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Missing Skills -->
        <div v-if="results.missingSkills?.length" class="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6">
          <h3 class="text-xl font-bold mb-4 text-yellow-700">⚠️ المهارات الناقصة</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in results.missingSkills" :key="skill" class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              {{ skill }}
            </span>
          </div>
          <p class="text-sm text-yellow-600 mt-4">
            هذه المهارات مطلوبة في سوق العمل، ننصح بتعلمها
          </p>
        </div>

        <!-- Recommendations -->
        <div class="bg-green-50 border border-green-200 rounded-2xl shadow p-6">
          <h3 class="text-xl font-bold mb-4 text-green-700">💡 التوصيات</h3>
          <ul class="space-y-2">
            <li v-for="rec in results.recommendations" :key="rec" class="flex items-start gap-2 text-sm text-green-700">
              <span class="mt-0.5">•</span>
              {{ rec }}
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <router-link to="/learning" class="btn-primary flex-1 text-center">
            📚 ابدأ مسار التعلم
          </router-link>
          <router-link to="/skill-verification" class="btn-secondary flex-1 text-center">
            ✅ وثق مهاراتك
          </router-link>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button @click="error = null" class="mt-2 text-sm text-red-500 hover:underline">
          حاول مرة أخرى
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAI } from '@/composables/useAI'

const { analyzeCV, isLoading } = useAI()

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const results = ref(null)
const error = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const clearFile = () => {
  selectedFile.value = null
  results.value = null
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const getLevelColor = (level) => {
  const colors = {
    'Beginner': 'text-gray-500',
    'Intermediate': 'text-yellow-500',
    'Advanced': 'text-blue-500',
    'Expert': 'text-purple-500',
  }
  return colors[level] || 'text-gray-500'
}

const analyzeCV = async () => {
  if (!selectedFile.value) return

  error.value = null
  results.value = null

  try {
    const response = await analyzeCV(selectedFile.value)
    results.value = {
      score: response.score || 75,
      level: response.level || 'متقدم',
      skills: response.skills || [
        { name: 'React.js', level: 'Advanced', score: 85 },
        { name: 'Vue.js', level: 'Intermediate', score: 70 },
        { name: 'JavaScript', level: 'Advanced', score: 80 },
        { name: 'Python', level: 'Intermediate', score: 65 },
      ],
      missingSkills: response.missingSkills || ['Node.js', 'TypeScript', 'GraphQL'],
      recommendations: response.recommendations || [
        'تعلم Node.js لتصبح Full-Stack Developer',
        'أضف مشاريع عملية إلى بروفايلك',
        'شارك في مشاريع مفتوحة المصدر',
      ],
    }
  } catch (err) {
    error.value = 'حدث خطأ أثناء تحليل السيرة الذاتية. حاول مرة أخرى.'
    console.error(err)
  }
}
</script>
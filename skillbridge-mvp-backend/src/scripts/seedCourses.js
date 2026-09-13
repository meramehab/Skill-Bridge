// سكريبت تشغيل مرة واحدة عشان يضيف الكورسات الستة الأساسية لقاعدة البيانات
// تشغيله: node src/scripts/seedCourses.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

const COURSES = [
  {
    title: 'Node.js & Express من الصفر للاحتراف',
    description: 'بناء APIs حقيقية بـ Node.js وExpress، من الأساسيات لحد نشر مشروع كامل.',
    skill: 'Node.js', level: 'beginner', provider: 'SkillBridge Academy',
    durationHours: 12, isFree: false, price: 350,
  },
  {
    title: 'React.js: بناء واجهات تفاعلية',
    description: 'تعلمي React من الصفر: Components, Hooks, وربطها بـ API حقيقي.',
    skill: 'React', level: 'beginner', provider: 'SkillBridge Academy',
    durationHours: 14, isFree: false, price: 400,
  },
  {
    title: 'قواعد البيانات: PostgreSQL و MongoDB',
    description: 'الفرق بين قواعد البيانات العلائقية والمستندية، وإزاي تختاري الصح لمشروعك.',
    skill: 'Database', level: 'intermediate', provider: 'SkillBridge Academy',
    durationHours: 10, isFree: false, price: 300,
  },
  {
    title: 'أساسيات الذكاء الاصطناعي وGemini API',
    description: 'إزاي تدمجي نماذج الذكاء الاصطناعي زي Gemini في تطبيقاتك بشكل عملي.',
    skill: 'AI', level: 'intermediate', provider: 'SkillBridge Academy',
    durationHours: 8, isFree: false, price: 450,
  },
  {
    title: 'Git & GitHub للمبتدئين',
    description: 'التحكم في نسخ الكود والعمل الجماعي بشكل احترافي من أول يوم.',
    skill: 'Git', level: 'beginner', provider: 'SkillBridge Academy',
    durationHours: 4, isFree: true, price: 0,
  },
  {
    title: 'UI/UX Design باستخدام Figma',
    description: 'أساسيات تصميم واجهات المستخدم وتجربة الاستخدام باستخدام Figma.',
    skill: 'UI/UX', level: 'beginner', provider: 'SkillBridge Academy',
    durationHours: 9, isFree: false, price: 350,
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل بقاعدة البيانات');

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌ مفيش يوزر role=admin في قاعدة البيانات. سجّلي حساب وعدّلي الـ role من MongoDB Atlas الأول.');
    process.exit(1);
  }

  let addedCount = 0;
  for (const courseData of COURSES) {
    const exists = await Course.findOne({ title: courseData.title });
    if (exists) {
      console.log(`↷ الكورس "${courseData.title}" موجود بالفعل، اتخطى`);
      continue;
    }
    await Course.create({ ...courseData, createdBy: admin._id });
    addedCount += 1;
    console.log(`✅ اتضاف: ${courseData.title}`);
  }

  console.log(`\nخلصنا! اتضاف ${addedCount} كورس جديد.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ حصل خطأ:', err.message);
  process.exit(1);
});

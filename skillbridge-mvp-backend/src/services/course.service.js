const Course = require('../models/Course');
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');
const ExamAttempt = require('../models/ExamAttempt');

const recalculateProgress = (modules) => {
  if (!modules.length) return 0;
  const completedCount = modules.filter((m) => m.completed).length;
  return Math.round((completedCount / modules.length) * 100);
};

const stripCorrectAnswers = (course) => {
  const obj = course.toObject ? course.toObject() : course;
  return {
    ...obj,
    questions: (obj.questions || []).map((q) => ({
      _id: q._id, questionText: q.questionText, options: q.options,
    })),
  };
};

const createCourse = async (adminId, data) => {
  return Course.create({ ...data, createdBy: adminId });
};

const getCourses = async (filters = {}) => {
  const query = { isActive: true };
  if (filters.skill) query.skill = new RegExp(filters.skill, 'i');
  if (filters.level) query.level = filters.level;
  const courses = await Course.find(query).sort({ createdAt: -1 });
  return courses.map(stripCorrectAnswers);
};

// نسخة كاملة بالإجابات الصحيحة - للإدارة بس (تُستخدم في صفحة إدارة الكورسات)
const getCoursesForAdmin = async () => {
  return Course.find({ isActive: true }).sort({ createdAt: -1 });
};

const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    const error = new Error('الكورس مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return stripCorrectAnswers(course);
};

const updateCourse = async (id, updates) => {
  const course = await Course.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!course) {
    const error = new Error('الكورس مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return course;
};

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!course) {
    const error = new Error('الكورس مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return course;
};

// الطالب بيضيف الكورس كوحدة (module) في مسار التعلم بتاعه
const enrollCourseInLearningPath = async (userId, courseId) => {
  const course = await getCourseById(courseId);

  let path = await LearningPath.findOne({ user: userId });
  if (!path) {
    path = await LearningPath.create({ user: userId, modules: [] });
  }

  const alreadyEnrolled = path.modules.some((m) => m.title === course.title);
  if (alreadyEnrolled) {
    const error = new Error('الكورس ده مضاف بالفعل لمسار التعلم بتاعك');
    error.statusCode = 400;
    throw error;
  }

  path.modules.push({
    title: course.title,
    resourceSuggestion: course.provider ? `${course.provider}${course.url ? ' - ' + course.url : ''}` : course.url,
    completed: false,
  });
  path.progressPercent = recalculateProgress(path.modules);
  await path.save();

  await User.findByIdAndUpdate(userId, { learningPathProgress: path.progressPercent });

  return path;
};

// ---------- اختبار الكورس ----------

// بيرجع الأسئلة من غير الإجابة الصحيحة (عشان الطالب متشوفهاش أبدًا من الـ API)
const getCourseExamQuestions = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('الكورس مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return {
    courseId: course._id,
    title: course.title,
    questions: course.questions.map((q, index) => ({
      index,
      questionText: q.questionText,
      options: q.options,
    })),
  };
};

const PASS_THRESHOLD = 60; // نسبة النجاح %

const submitCourseExam = async (userId, courseId, answers) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('الكورس مش موجود');
    error.statusCode = 404;
    throw error;
  }

  if (!course.questions.length) {
    const error = new Error('الكورس ده لسه مفيهوش أسئلة اختبار');
    error.statusCode = 400;
    throw error;
  }
  if (!Array.isArray(answers) || answers.length !== course.questions.length) {
    const error = new Error('عدد الإجابات مش مطابق لعدد الأسئلة');
    error.statusCode = 400;
    throw error;
  }

  let correctCount = 0;
  course.questions.forEach((q, index) => {
    if (Number(answers[index]) === q.correctOptionIndex) correctCount += 1;
  });

  const score = Math.round((correctCount / course.questions.length) * 100);
  const passed = score >= PASS_THRESHOLD;

  const attempt = await ExamAttempt.create({
    user: userId,
    course: courseId,
    answers,
    score,
    passed,
    submittedAt: new Date(),
  });

  // لو نجح، نعلّم الكورس كـ "مكتمل" في مسار التعلم بتاعه لو مضاف بالفعل
  if (passed) {
    const path = await LearningPath.findOne({ user: userId });
    if (path) {
      const moduleItem = path.modules.find((m) => m.title === course.title);
      if (moduleItem) {
        moduleItem.completed = true;
        path.progressPercent = Math.round(
          (path.modules.filter((m) => m.completed).length / path.modules.length) * 100
        );
        await path.save();
        await User.findByIdAndUpdate(userId, { learningPathProgress: path.progressPercent });
      }
    }
  }

  return { score, passed, correctCount, totalQuestions: course.questions.length };
};

module.exports = {
  createCourse,
  getCourses,
  getCoursesForAdmin,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourseInLearningPath,
  getCourseExamQuestions,
  submitCourseExam,
};

const courseService = require('../services/course.service');

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.user.id, req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses(req.query);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// نسخة كاملة (بالإجابات الصحيحة) - للأدمن بس، تُستخدم في صفحة إدارة الكورسات
const getCoursesForAdmin = async (req, res) => {
  try {
    const courses = await courseService.getCoursesForAdmin();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الكورس' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const path = await courseService.enrollCourseInLearningPath(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// عرض أسئلة الاختبار (من غير الإجابات الصحيحة)
const getExamQuestions = async (req, res) => {
  try {
    const exam = await courseService.getCourseExamQuestions(req.params.id);
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// تسليم إجابات الاختبار وحساب النتيجة
const submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const result = await courseService.submitCourseExam(req.user.id, req.params.id, answers);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCoursesForAdmin,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getExamQuestions,
  submitExam,
};

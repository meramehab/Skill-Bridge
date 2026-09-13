const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCoursesForAdmin,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getExamQuestions,
  submitExam,
} = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/admin/all', protect, authorize('admin'), getCoursesForAdmin);
router.post('/', protect, authorize('admin'), createCourse);
router.get('/:id', getCourseById);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.get('/:id/exam', protect, getExamQuestions);
router.post('/:id/exam/submit', protect, submitExam);

module.exports = router;

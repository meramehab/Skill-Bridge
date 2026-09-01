const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const chatbot = require('../ai/chatbot');
const { analyzeCV, extractTextFromPDF } = require('../ai/cvParser');
const { analyzeCVTextWithGemini } = require('../ai/gemini/analyzeCvGemini');
const {
  analyzeCodeQuality,
  generateQuiz,
  assessPracticalTask,
  assessDisputeRisk,
  aiQualityGate,
  predictMarketTrends,
  getAIJuryRecommendation,
} = require('../ai/simpleModels');
const { generateProposal } = require('../ai/proposalGenerator');
const { generateContractDraft } = require('../ai/contractGenerator');
const { buildPortfolio } = require('../ai/portfolioBuilder');

const CV = require('../models/CV');
const User = require('../models/User');
const Project = require('../models/Project');
const Dispute = require('../models/Dispute');
const Leaderboard = require('../models/Leaderboard');
const analyticsService = require('../services/analytics.service');

const { protect, authorize } = require('../middleware/auth');

// إعداد رفع الملفات (السير الذاتية)
const upload = multer({
  dest: path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------- Chatbot (In-House) ----------
router.post('/chatbot', protect, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ success: false, message: 'الرسالة و sessionId مطلوبين' });
    }
    const result = await chatbot.getResponse(message, req.user.id, sessionId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- CV Analysis & Parsing + Skill/Missing Skills/Career Score/Learning Path ----------
router.post('/cv/analyze', protect, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لازم ترفع ملف الـ CV' });
    }

    const targetPathSkills = req.body.targetSkills
      ? JSON.parse(req.body.targetSkills)
      : [];

    const result = await analyzeCV(req.file.path, targetPathSkills);

    const cv = await CV.create({
      user: req.user.id,
      originalFileUrl: req.file.path,
      rawText: result.rawText,
      extractedSkills: result.extractedSkills,
      missingSkills: result.missingSkills,
      careerReadinessScore: result.careerReadinessScore,
      suggestedLearningPath: result.suggestedLearningPath,
    });

    await User.findByIdAndUpdate(req.user.id, {
      skills: result.extractedSkills,
      careerReadinessScore: result.careerReadinessScore,
    });

    res.status(200).json({ success: true, data: cv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- CV Analysis بـ Gemini الحقيقي ----------
// endpoint منفصل عن /cv/analyze الأصلي (Rule-Based) عشان القديمة تفضل شغالة كـ fallback
// من غير API key. لو GEMINI_API_KEY متظبط في .env، استخدموا الـ endpoint ده بدلها.
router.post('/cv/analyze-gemini', protect, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لازم ترفع ملف الـ CV' });
    }

    // استخراج النص بنفس مكتبة pdf-parse الموجودة عندنا في المشروع (v1)
    const rawText = await extractTextFromPDF(req.file.path);

    // تحليل النص فعليًا بـ Gemini (تحليل النص فعليًا بـ Gemini)
    const geminiResult = await analyzeCVTextWithGemini(rawText);

    const cv = await CV.create({
      user: req.user.id,
      originalFileUrl: req.file.path,
      rawText,
      extractedSkills: geminiResult.skills || [],
      missingSkills: [], // Gemini مش بيرجع "missing skills" بنفس منطق النسخة القديمة
      careerReadinessScore: 0, // مش جزء من مخرجات Gemini الحالية
      suggestedLearningPath: [],
    });

    await User.findByIdAndUpdate(req.user.id, {
      skills: geminiResult.skills || [],
    });

    res.status(200).json({
      success: true,
      data: {
        cvId: cv._id,
        ...geminiResult, // personalInfo, skills, education, experience, projects, suggestedRoles, summary
      },
    });
  } catch (error) {
    // لو الـ API key مش متظبط أو Gemini رجّع خطأ، بنرجّع رسالة واضحة بدل ما نكسر السيرفر
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- Code Quality Analysis ----------
router.post('/code/analyze', protect, (req, res) => {
  try {
    const { code } = req.body;
    const result = analyzeCodeQuality(code);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- Quiz Generation ----------
router.get('/quiz/:skill', protect, (req, res) => {
  try {
    const count = parseInt(req.query.count) || 3;
    const quiz = generateQuiz(req.params.skill, count);
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- Practical Task Assessment ----------
router.post('/assess-task', protect, (req, res) => {
  try {
    const result = assessPracticalTask(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- Risk Detection (يُستخدم أيضًا تلقائيًا عند فتح نزاع) ----------
router.post('/risk-check', protect, (req, res) => {
  try {
    const { text } = req.body;
    const result = assessDisputeRisk(text);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== AI متقدم ==================

// ---------- AI Quality Gate (فحص جودة + أمان أوسع من code/analyze) ----------
router.post('/quality-gate', protect, (req, res) => {
  try {
    const { code } = req.body;
    const result = aiQualityGate(code);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- AI Proposal Generator ----------
router.post('/proposal/:projectId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'المشروع مش موجود' });
    }

    const student = await User.findById(req.user.id);
    const result = generateProposal({
      studentName: student.fullName,
      studentSkills: student.skills,
      studentBio: student.bio,
      project,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- AI Contract Generator ----------
router.post('/contract/:projectId', protect, async (req, res) => {
  try {
    const { studentId, agreedAmount, deadline } = req.body;

    const project = await Project.findById(req.params.projectId).populate('client', 'fullName');
    if (!project) {
      return res.status(404).json({ success: false, message: 'المشروع مش موجود' });
    }

    const student = await User.findById(studentId);
    const result = generateContractDraft({
      project,
      client: project.client,
      student,
      agreedAmount,
      deadline: deadline || project.deadline,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- Market Predictor ----------
router.get('/market-predictor', protect, async (req, res) => {
  try {
    const topSkills = await analyticsService.getTopSkillsInDemand(10);
    const result = predictMarketTrends(topSkills);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- AI Portfolio Builder ----------
router.get('/portfolio', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const completedProjects = await Project.find({ assignedTo: req.user.id, status: 'completed' });
    const cv = await CV.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    const leaderboard = await Leaderboard.findOne({ user: req.user.id });

    const portfolio = buildPortfolio({ user, completedProjects, cv, leaderboard });
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- AI-Jury (توصية أولية في حالة نزاع) ----------
router.get('/jury/:disputeId', protect, authorize('admin'), async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.disputeId);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'النزاع مش موجود' });
    }

    const result = getAIJuryRecommendation({
      reason: dispute.reason,
      raiserEvidenceCount: dispute.evidenceUrls?.length || 0,
      defendantEvidenceCount: 0, // MVP: مفيش حقل منفصل لأدلة الطرف التاني لسه
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

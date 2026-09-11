/**
 * @file SkillVerificationLogicView.jsx
 * @description Modern Figma presentation layer for the Skill Verification page connecting useSkillVerification.
 * Features assessment type selector cards, instant quiz runner simulation, and skill pass/fail certificate gauge.
 */
import React from "react";
import { useSkillVerification } from "../../hooks/useSkillVerification";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { ProgressBarLogic as ProgressBar } from "../../components/contracts/ProgressBarLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Code2,
  FileCheck,
  RotateCcw,
  ArrowLeft
} from "lucide-react";

export function SkillVerificationLogicView({
  CardComponent = Card,
  ButtonComponent = Button,
  ProgressBarComponent = ProgressBar,
  BadgeComponent = Badge
}) {
  const {
    selectedSkill,
    setSelectedSkill,
    selectedType,
    setSelectedType,
    result,
    isLoading,
    error,
    availableSkills,
    assessmentTypes,
    startAssessment
  } = useSkillVerification();

  return (
    <div id="skill-verification-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>تقييم واعتماد المهارات التقنية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
              تقييم وتوثيق المهارات (Skill Verification) 🎖️
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              أثبت كفاءتك في المهارات التقنية المطلوبة بسوق العمل من خلال اختبارات ومهام عملية معتمدة من الجامعات الشريكة.
            </p>
          </div>

          {/* ─── Step 1: Select Skill ─── */}
          <CardComponent variant="surface" className="p-6 sm:p-8 border border-[#222634]">
            <label htmlFor="skill-select" className="block text-sm font-bold text-white mb-2">
              1. اختر المهارة التي ترغب في تقييمها:
            </label>
            <select
              id="skill-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-[#2a2f3e] bg-[#181b24] text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
            >
              <option value="">-- اختر مهارة تقنية للتقييم --</option>
              {availableSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </CardComponent>

          {/* ─── Step 2: Assessment Type Selection ─── */}
          <CardComponent variant="surface" className="p-6 sm:p-8 border border-[#222634]">
            <h3 className="text-sm font-bold text-white mb-4">2. اختر نوع التقييم المناسب لمستواك:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessmentTypes.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-6 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/15 scale-[1.02]"
                        : "border-[#222634] bg-[#181b24] hover:border-emerald-500/40 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-3xl mb-3">{type.icon}</span>
                    <p className="font-bold text-white text-base mb-1">{type.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </CardComponent>

          {/* ─── Start Assessment Button ─── */}
          <ButtonComponent
            id="btn-start-assessment"
            variant="primary"
            size="lg"
            onClick={startAssessment}
            disabled={!selectedSkill || !selectedType || isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span>جاري إعداد الاختبار وحساب النتيجة الذكية...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 ml-1" />
                <span>ابدأ التقييم الفوري الآن</span>
              </>
            )}
          </ButtonComponent>

          {/* ─── Results Card ─── */}
          {result && (
            <CardComponent id="assessment-result-card" variant="glow" className="p-8 border border-emerald-500/40 animate-fadeIn space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                نتيجة التقييم والاعتماد
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#181b24] p-6 rounded-2xl border border-[#262c3d]">
                <div className="text-center min-w-[110px]">
                  <p className="text-4xl font-extrabold text-emerald-400 font-mono">{result.score}%</p>
                  <p className="text-xs font-semibold text-gray-400 mt-1">النتيجة النهائية</p>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <ProgressBarComponent
                    value={result.score}
                    color="gradient"
                    size="lg"
                    showPercentage={false}
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-mono font-medium">
                    <span>مبتدئ</span>
                    <span className="text-emerald-400 font-bold">{result.level}</span>
                    <span>خبير</span>
                  </div>
                </div>

                <div className="text-center flex flex-col items-center min-w-[100px]">
                  {result.passed ? (
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-400 mb-1" />
                  )}
                  <span className={`text-xs font-mono font-bold ${result.passed ? "text-emerald-400" : "text-red-400"}`}>
                    {result.passed ? "اجتاز بنجاح ✅" : "لم يجتز"}
                  </span>
                </div>
              </div>

              {result.feedback && (
                <div className="p-4 bg-[#13161e] rounded-xl border border-[#222634]">
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">{result.feedback}</p>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <a
                  href="/profile"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-xl text-center text-xs sm:text-sm hover:brightness-105 transition"
                >
                  عرض الشارة في الملف الشخصي
                </a>
                <a
                  href="/marketplace"
                  className="flex-1 bg-[#181b24] border border-[#262c3d] text-white font-bold py-3 rounded-xl text-center text-xs sm:text-sm hover:bg-white/5 transition"
                >
                  استكشاف المشاريع المتوافقة
                </a>
              </div>
            </CardComponent>
          )}

          {/* Error Notice */}
          {error && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center text-red-400 text-xs sm:text-sm">
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SkillVerificationLogicView;

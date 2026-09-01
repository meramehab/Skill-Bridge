/**
 * @file SkillVerificationLogicView.jsx
 * @description Logic wiring for Skill Verification assessments, interactive quiz/task selector, and evaluation result.
 */
import React from "react";
import {
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { useSkillVerification } from "../../hooks/useSkillVerification";

export function SkillVerificationLogicView() {
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
    <div id="skill-verification-container" className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Award className="w-8 h-8 text-indigo-600" />
          تقييم وتوثيق المهارات
        </h1>
        <p className="text-gray-600 text-base max-w-lg mx-auto">
          أثبت كفاءتك في المهارات التقنية من خلال الاختبارات والمهام العملية المعتمدة
        </p>
      </div>

      {/* Select Skill */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <label htmlFor="skill-select" className="block text-sm font-bold text-gray-800 mb-2">
          اختر المهارة التي ترغب في تقييمها:
        </label>
        <select
          id="skill-select"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="">-- اختر مهارة تقنية --</option>
          {availableSkills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assessment Type Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">اختر نوع التقييم المناسب</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assessmentTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`p-5 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50"
                }`}
              >
                <span className="text-3xl mb-2">{type.icon}</span>
                <p className="font-bold text-gray-900 text-base mb-1">{type.name}</p>
                <p className="text-xs text-gray-500 font-medium">{type.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <button
        id="btn-start-assessment"
        onClick={startAssessment}
        disabled={!selectedSkill || !selectedType || isLoading}
        className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>جاري إعداد التقييم وحساب النتيجة...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>ابدأ التقييم الفوري</span>
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div id="assessment-result-card" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-900 mb-4">نتيجة التقييم والاعتماد</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center min-w-[100px]">
              <p className="text-4xl font-extrabold text-indigo-600">{result.score}%</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">النتيجة النهائية</p>
            </div>

            <div className="flex-1 w-full">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>مبتدئ</span>
                <span className="text-indigo-600 font-bold">{result.level}</span>
                <span>خبير</span>
              </div>
            </div>

            <div className="text-center flex flex-col items-center min-w-[90px]">
              {result.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-1" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500 mb-1" />
              )}
              <span className={`text-xs font-bold ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
                {result.passed ? "اجتاز بنجاح ✅" : "لم يجتز"}
              </span>
            </div>
          </div>

          {result.feedback && (
            <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{result.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center mt-6 text-red-700 text-sm">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default SkillVerificationLogicView;

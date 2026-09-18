/**
 * @file HomeLogicView.jsx
 * @description Modern Figma presentation layer for Landing / Home page connecting useHomeStats.
 * Features hero with circuit lines, platform stats cards, feature pillars, and top student highlights.
 */
import React from "react";
import { useHomeStats } from "../../hooks/useHomeStats";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Code2
} from "lucide-react";

export function HomeLogicView() {
  const { status, stats, isLoading, isError, refetch, primaryCtaAction } = useHomeStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div className="container-custom py-24 flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-mono text-sm">جاري تحميل منصة SkillBridge...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div id="home-logic-container" className="min-h-screen bg-[#0f1117] text-white selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section id="hero-section" className="relative pt-16 pb-20 overflow-hidden border-b border-[#1e2330]">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-6 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منصة التأهيل الأكاديمي والعمل الحر الأولى للجامعات</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.2] mb-6">
              تُأهّل · تُوثّق · تُوظّف <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
                في منصة ذكية واحدة لطلاب الجامعات
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
              تحقق من هويتك الجامعية، طور مهاراتك بمسارات التعلم والذكاء الاصطناعي، وانضم لمشاريع العمل الحر الحقيقية مع نظام دفع آمن ومحمي.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                id="btn-home-primary-cta"
                size="lg"
                variant="primary"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = primaryCtaAction?.targetRoute || "/register";
                  }
                }}
              >
                <span>{primaryCtaAction?.label || "ابدأ رحلتك الآن مجاناً"}</span>
                <ArrowLeft className="w-5 h-5 mr-1" />
              </Button>

              <Button
                id="btn-home-explore"
                size="lg"
                variant="secondary"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/marketplace";
                  }
                }}
              >
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>استكشف سوق المشاريع</span>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── Platform Statistics Grid ─── */}
        {stats && (
          <section id="stats-section" className="py-14 bg-[#0c0e14] border-b border-[#1e2330]">
            <div className="container-custom">
              <div id="stats-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <Card id="stat-students" variant="glow" className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 block mb-1">إجمالي الطلاب المسجلين</span>
                  <strong className="text-3xl font-extrabold text-white font-mono">
                    {stats.totalStudents?.toLocaleString("ar-EG")}
                  </strong>
                </Card>

                <Card id="stat-projects" variant="elevated" className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 block mb-1">مشاريع منجزة بنجاح</span>
                  <strong className="text-3xl font-extrabold text-white font-mono">
                    {stats.completedProjects?.toLocaleString("ar-EG")}
                  </strong>
                </Card>

                <Card id="stat-universities" variant="elevated" className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 block mb-1">جامعات ومؤسسات شريكة</span>
                  <strong className="text-3xl font-extrabold text-white font-mono">
                    {stats.partnerUniversities}
                  </strong>
                </Card>

                <Card id="stat-earnings" variant="glow" className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 block mb-1">إجمالي أرباح الطلاب</span>
                  <strong className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {stats.totalEarningsEGP?.toLocaleString("ar-EG")} <span className="text-sm">ج.م</span>
                  </strong>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* ─── Platform Pillars / Feature Panels ─── */}
        <section className="py-20 bg-[#0f1117] border-b border-[#1e2330]">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge type="new" label="مزايا متكاملة" className="mb-3" />
              <h2 className="text-3xl font-display font-extrabold text-white mb-3">
                كل ما يحتاجه الطالب للانطلاق لسوق العمل
              </h2>
              <p className="text-gray-400 text-sm">
                حلول رقمية مبتكرة تبني جسراً حقيقياً بين الدراسة الأكاديمية والعمل الحر
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="surface" className="p-7">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">التأهيل والمسارات المخصصة</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  تحليل السيرة الذاتية واقتراح مسارات تعليمية سريعة تسد الفجوة بين الجامعة ومتطلبات السوق.
                </p>
                <a href="/learning" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                  <span>اكتشف المسارات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </Card>

              <Card variant="surface" className="p-7">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">التوثيق الجامعي والشهادات</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  توثيق رسمي للبطاقة الجامعية والمهارات التقنية واختبارات عملية معتمدة لرفع الموثوقية.
                </p>
                <a href="/skill-verification" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300">
                  <span>توثيق المهارات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </Card>

              <Card variant="surface" className="p-7">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">العمل الحر والفرق الذكية (Squads)</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  فرص عمل حقيقية ومشاريع برمجية وتصميمية وإمكانية تكوين فرق متعددة المهارات.
                </p>
                <a href="/squad" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300">
                  <span>استكشف الفرق</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* ─── Top Students Highlights ─── */}
        {stats?.topStudents?.length > 0 && (
          <section id="top-students-section" className="py-20 bg-[#0c0e14]">
            <div className="container-custom">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    أبرز الطلاب المتميزين هذا الأسبوع 🏆
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">الطلاب الأكثر إنجازاً وتقييماً في مسارات العمل الحر</p>
                </div>
                <a href="/leaderboard" className="text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  <span>عرض لوحة المتصدرين بالكامل</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </div>

              <div id="students-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.topStudents.map((std) => (
                  <Card key={std.id} id={`top-student-${std.id}`} variant="elevated" className="p-6 text-center">
                    <div className="relative w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-emerald-500/40 p-0.5 bg-[#181b24]">
                      <img src={std.avatar} alt={std.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{std.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{std.university} - {std.faculty}</p>
                    <Badge type="level_pro" label={`${std.xp} XP`} />
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Safe Error Fallback Notice */}
        {isError && (
          <div id="stats-fallback-alert" className="container-custom py-6">
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl flex items-center justify-between text-sm">
              <span>يتم عرض إحصائيات تقريبية للمنصة حالياً.</span>
              <Button size="sm" variant="outline" onClick={refetch}>تحديث الإحصائيات</Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default HomeLogicView;

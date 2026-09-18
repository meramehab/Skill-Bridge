/**
 * @file MarketplaceLogicView.jsx
 * @description Modern Figma presentation layer for the Marketplace page connecting useMarketplace.
 * Features locked gate state, filters toolbar, project cards, price badges, and load more pagination.
 */
import React from "react";
import { useMarketplace } from "../../hooks/useMarketplace";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  Lock,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Users,
  Coins,
  ArrowRight
} from "lucide-react";

export function MarketplaceLogicView() {
  const {
    status,
    projects,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    isSuccess,
    isError,
    isEmpty,
    error,
    filters,
    isUnlocked,
    careerReadinessScore,
    updateSearch,
    setFilter,
    resetFilters,
    loadMore,
    refetch
  } = useMarketplace();

  // ─── Freelancing Gate: Locked State ───
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        <Navbar />

        <main className="flex-1 container-custom py-16 flex items-center justify-center">
          <Card id="marketplace-locked-gate" variant="elevated" className="max-w-xl text-center p-8 sm:p-12 border border-amber-500/30">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-5 ring-1 ring-amber-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
              سوق العمل الحر مقفل حالياً 🔒
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              وفقاً لمعايير الجودة في منصة SkillBridge، يلزم الوصول إلى مؤشر جاهزية مهنية <strong>70%</strong> على الأقل للتقديم على المشاريع الحقيقية.
            </p>

            <div className="bg-[#181b24] p-4 rounded-2xl border border-[#262c3d] mb-8 inline-block">
              <span className="text-xs text-gray-400 block mb-1">مؤشر جاهزيتك الحالي:</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono">{careerReadinessScore}%</span>
            </div>

            <Button
              id="btn-goto-learning-path"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/learning";
                }
              }}
            >
              <span>الذهاب لمسار التعلم واجتياز التقييمات السريعة</span>
              <ArrowLeft className="w-4 h-4 mr-1" />
            </Button>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div id="marketplace-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-10 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>مشاريع ومهام معتمدة للطلاب</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
              سوق العمل والمشاريع للطلاب
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              تصفح أحدث المشاريع والـ Micro Gigs المتاحة من شركات موثوقة وقدم عروضك مباشرة مع ضمان حقوقك بنظام Escrow.
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="bg-[#13161e] border border-[#222634] rounded-2xl p-4 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  id="search-projects-input"
                  type="text"
                  placeholder="ابحث باسم المشروع أو التقنية (React, UI/UX, Python, Node.js...)"
                  value={filters.search}
                  onChange={(e) => updateSearch(e.target.value)}
                  className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-500 focus:outline-none transition"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Filters dropdowns */}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  id="filter-type-select"
                  value={filters.type}
                  onChange={(e) => setFilter("type", e.target.value)}
                  className="bg-[#181b24] border border-[#2a2f3e] text-xs font-semibold rounded-xl px-3.5 py-3 text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">جميع أنواع المشاريع</option>
                  <option value="project">مشاريع متكاملة</option>
                  <option value="micro_gig">مهام مصغرة (Micro Gigs)</option>
                </select>

                <select
                  id="filter-sort-select"
                  value={filters.sortBy}
                  onChange={(e) => setFilter("sortBy", e.target.value)}
                  className="bg-[#181b24] border border-[#2a2f3e] text-xs font-semibold rounded-xl px-3.5 py-3 text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="newest">الأحدث نشرًا</option>
                  <option value="highest_budget">الأعلى ميزانية</option>
                </select>

                <Button
                  id="btn-reset-filters"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط</span>
                </Button>
              </div>
            </div>
          </div>

          {/* ─── State Handlers ─── */}
          {isLoading && (
            <div id="projects-skeleton" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-[#13161e] border border-[#222634] rounded-2xl p-6 animate-pulse space-y-4">
                  <div className="h-5 bg-white/10 rounded w-1/3" />
                  <div className="h-6 bg-white/15 rounded w-3/4" />
                  <div className="h-14 bg-white/5 rounded" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div id="marketplace-error-box" className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center max-w-lg mx-auto">
              <p className="text-sm text-red-400 font-medium mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={refetch}>
                إعادة المحاولة
              </Button>
            </div>
          )}

          {isEmpty && (
            <div id="marketplace-empty-box" className="p-12 rounded-2xl bg-[#13161e] border border-[#222634] text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/5 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">لا توجد مشاريع تطابق خيارات البحث</h3>
              <p className="text-xs text-gray-400 mb-6">جرّب تعديل كلمات البحث أو مسح الفلاتر المختارة.</p>
              <Button variant="primary" size="sm" onClick={resetFilters}>
                عرض كل المشاريع
              </Button>
            </div>
          )}

          {/* ─── Projects List ─── */}
          {isSuccess && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p id="results-count" className="text-xs font-mono text-gray-400 font-bold">
                  تم العثور على <span className="text-emerald-400">{total}</span> مشروع متاح
                </p>
              </div>

              <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    id={`project-card-${project.id}`}
                    variant="elevated"
                    className="flex flex-col justify-between p-6 border border-[#222634] hover:border-emerald-500/50 cursor-pointer group"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = `/project/${project.id}`;
                      }
                    }}
                  >
                    <div>
                      {/* Meta header */}
                      <div id="project-meta-header" className="flex items-center justify-between gap-2 mb-4">
                        <Badge
                          type={project.type === "micro_gig" ? "micro_gig" : "project"}
                          label={project.type === "micro_gig" ? "Micro Gig" : "مشروع متكامل"}
                        />
                        <span id="project-budget" className="text-sm font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                          {project.budget} ج.م
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-title font-bold text-lg text-white mb-2 group-hover:text-emerald-400 transition line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">
                        {project.description}
                      </p>

                      {/* Required skills tags */}
                      <div id="skills-tags" className="flex flex-wrap gap-1.5 mb-6">
                        {project.requiredSkills?.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#181b24] text-gray-300 border border-[#2a2f3e]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div id="project-card-footer" className="pt-4 border-t border-[#1e2330] flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        {project.clientName}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {project.proposalsCount} عروض مقدمة
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More Pagination */}
              {hasMore && (
                <div id="load-more-section" className="text-center mt-12">
                  <Button
                    id="btn-load-more"
                    variant="secondary"
                    size="md"
                    onClick={loadMore}
                    isLoading={isLoadingMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "جارٍ التحميل..." : "تحميل المزيد من المشاريع"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MarketplaceLogicView;

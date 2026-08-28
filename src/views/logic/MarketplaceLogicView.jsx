/**
 * @file MarketplaceLogicView.jsx
 * @description Logic wiring for Marketplace page, managing unlocked gate, filters, and infinite list.
 */
import React from "react";
import { useMarketplace } from "../../hooks/useMarketplace";

export function MarketplaceLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Input = (p) => <input {...p} />,
  Badge = (p) => <span {...p} />,
  Skeleton = () => <div>Loading...</div>
}) {
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

  // Freelancing Gate: Locked State
  if (!isUnlocked) {
    return (
      <Card id="marketplace-locked-gate">
        <h2>🔒 سوق العمل الحر مقفل حالياً</h2>
        <p>
          وفقاً لمعايير منصة SkillBridge، يلزم الوصول إلى مؤشر جاهزية 70% على الأقل للتقديم على المشاريع.
        </p>
        <p>مؤشرك الحالي: <strong>{careerReadinessScore}%</strong></p>
        <Button
          id="btn-goto-learning-path"
          onClick={() => {
            window.location.href = "/learning-path";
          }}
        >
          الذهاب لمسار التعلم واجتياز التقييمات
        </Button>
      </Card>
    );
  }

  return (
    <div id="marketplace-container">
      {/* Header & Search */}
      <header id="marketplace-header">
        <h1>سوق العمل والمشاريع للطلاب</h1>
        <p>تصفح أحدث المشاريع والـ Micro Gigs المتاحة وقدم عروضك مباشرة.</p>

        <Input
          id="search-projects-input"
          placeholder="ابحث باسم المشروع أو التقنية (React, Next.js...)"
          value={filters.search}
          onChange={(e) => updateSearch(e.target.value)}
        />
      </header>

      {/* Filters Toolbar */}
      <div id="filters-toolbar">
        <select
          id="filter-type-select"
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value)}
        >
          <option value="all">جميع الأنواع</option>
          <option value="project">مشاريع متكاملة</option>
          <option value="micro_gig">مهام مصغرة (Micro Gigs)</option>
        </select>

        <select
          id="filter-sort-select"
          value={filters.sortBy}
          onChange={(e) => setFilter("sortBy", e.target.value)}
        >
          <option value="newest">الأحدث</option>
          <option value="highest_budget">الأعلى ميزانية</option>
        </select>

        <Button id="btn-reset-filters" onClick={resetFilters}>
          إعادة ضبط الفلاتر
        </Button>
      </div>

      {/* States Handling */}
      {isLoading && <Skeleton id="projects-skeleton" />}

      {isError && (
        <div id="marketplace-error-box">
          <p>{error}</p>
          <Button onClick={refetch}>إعادة المحاولة</Button>
        </div>
      )}

      {isEmpty && (
        <div id="marketplace-empty-box">
          <h3>لا توجد مشاريع تطابق خيارات البحث</h3>
          <p>جرّب تعديل كلمات البحث أو مسح الفلاتر المختارة.</p>
          <Button onClick={resetFilters}>عرض كل المشاريع</Button>
        </div>
      )}

      {/* Projects List */}
      {isSuccess && (
        <div id="projects-grid">
          <p id="results-count">تم العثور على {total} مشروع</p>
          {projects.map((project) => (
            <Card
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => {
                window.location.href = `/marketplace/${project.id}`;
              }}
            >
              <div id="project-meta-header">
                <Badge
                  type={project.type === "micro_gig" ? "micro_gig" : "project"}
                  label={project.type === "micro_gig" ? "Micro Gig" : "مشروع"}
                />
                <span id="project-budget">{project.budget} ج.م</span>
              </div>

              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div id="skills-tags">
                {project.requiredSkills?.map((skill) => (
                  <Badge key={skill} type="skill" label={skill} />
                ))}
              </div>

              <div id="project-card-footer">
                <span>العميل: {project.clientName}</span>
                <span>العروض: {project.proposalsCount}</span>
              </div>
            </Card>
          ))}

          {/* Load More Button / Infinite Scroll Trigger */}
          {hasMore && (
            <div id="load-more-section">
              <Button
                id="btn-load-more"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "جارٍ التحميل..." : "تحميل المزيد من المشاريع"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketplaceLogicView;

/**
 * @file BadgeLogic.jsx
 * @description Logic helper for Badges (Verified Student, Skill, Level, Squad status).
 */
import React, { useMemo } from "react";

export function BadgeLogic({ type = "default", label = "", renderBadge }) {
  const badgeConfig = useMemo(() => {
    switch (type) {
      case "verified_student":
        return { label: label || "طالب موثق", iconName: "check-circle", variant: "success" };
      case "unverified":
        return { label: label || "قيد التحقق", iconName: "clock", variant: "warning" };
      case "skill":
        return { label: label || "مهارة موثقة", iconName: "award", variant: "primary" };
      case "level_pro":
        return { label: label || "محترف", iconName: "shield", variant: "gold" };
      case "micro_gig":
        return { label: label || "مهمة مصغرة (Micro Gig)", iconName: "zap", variant: "info" };
      case "project":
        return { label: label || "مشروع متكامل", iconName: "briefcase", variant: "purple" };
      default:
        return { label: label || "شارة", iconName: "tag", variant: "neutral" };
    }
  }, [type, label]);

  const logicProps = {
    ...badgeConfig,
    type
  };

  if (typeof renderBadge === "function") {
    return renderBadge(logicProps);
  }

  return logicProps;
}

export default BadgeLogic;

/**
 * @file BadgeLogic.jsx
 * @description Logic helper & modern presentation for SkillBridge Badges (Verified Student, Skill, XP, Level, Project).
 */
import React, { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Award,
  Shield,
  Zap,
  Briefcase,
  Flame,
  Sparkles,
  Tag
} from "lucide-react";

export function BadgeLogic({
  type = "default",
  label = "",
  size = "md", // sm | md
  className = "",
  renderBadge
}) {
  const badgeConfig = useMemo(() => {
    switch (type) {
      case "verified_student":
        return {
          label: label || "طالب موثق",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
        };
      case "unverified":
        return {
          label: label || "قيد التحقق",
          icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
          style: "bg-amber-500/10 text-amber-400 border border-amber-500/30"
        };
      case "skill":
        return {
          label: label || "مهارة موثقة",
          icon: <Award className="w-3.5 h-3.5 text-emerald-400" />,
          style: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
        };
      case "level_pro":
        return {
          label: label || "محترف",
          icon: <Shield className="w-3.5 h-3.5 text-amber-400" />,
          style: "bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10"
        };
      case "micro_gig":
        return {
          label: label || "مهمة مصغرة (Micro Gig)",
          icon: <Zap className="w-3.5 h-3.5 text-blue-400" />,
          style: "bg-blue-500/15 text-blue-300 border border-blue-500/30"
        };
      case "project":
        return {
          label: label || "مشروع متكامل",
          icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />,
          style: "bg-purple-500/15 text-purple-300 border border-purple-500/30"
        };
      case "hot":
        return {
          label: label || "فرصة مميزة",
          icon: <Flame className="w-3.5 h-3.5 text-red-400" />,
          style: "bg-red-500/15 text-red-300 border border-red-500/30 animate-pulse"
        };
      case "new":
        return {
          label: label || "جديد",
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
          style: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
        };
      default:
        return {
          label: label || "شارة",
          icon: <Tag className="w-3.5 h-3.5 text-gray-400" />,
          style: "bg-[#1e2330] text-gray-300 border border-[#2a2f3e]"
        };
    }
  }, [type, label]);

  const sizeStyle = size === "sm" ? "text-[10px] px-2 py-0.5 gap-1" : "text-xs px-3 py-1 gap-1.5 font-bold";

  const computedClassName = `inline-flex items-center rounded-full font-mono transition select-none ${sizeStyle} ${badgeConfig.style} ${className}`;

  const logicProps = {
    ...badgeConfig,
    type,
    className: computedClassName
  };

  if (typeof renderBadge === "function") {
    return renderBadge(logicProps);
  }

  return (
    <span className={computedClassName}>
      {badgeConfig.icon}
      <span>{badgeConfig.label}</span>
    </span>
  );
}

export default BadgeLogic;

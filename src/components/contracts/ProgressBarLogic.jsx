/**
 * @file ProgressBarLogic.jsx
 * @description Logic helper & modern presentation for Progress Bars, Career Readiness Gauges, and step completion indicators.
 */
import React from "react";

export function ProgressBarLogic({
  value = 0,
  max = 100,
  label = "",
  color = "emerald", // emerald | blue | yellow | purple | gradient
  size = "md", // sm | md | lg
  showPercentage = true,
  className = "",
  renderProgressBar
}) {
  const safePercentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorStyles = {
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-400",
    blue: "bg-gradient-to-r from-blue-600 to-indigo-500",
    yellow: "bg-gradient-to-r from-amber-500 to-yellow-400",
    purple: "bg-gradient-to-r from-purple-600 to-pink-500",
    gradient: "bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600"
  };

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  const logicProps = {
    value,
    max,
    percentage: safePercentage,
    label
  };

  if (typeof renderProgressBar === "function") {
    return renderProgressBar(logicProps);
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-gray-300 mb-1.5">
          {label ? <span>{label}</span> : <div />}
          {showPercentage && <span className="font-mono text-emerald-400">{safePercentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#181b24] rounded-full overflow-hidden border border-[#222634] ${heightStyles[size] || heightStyles.md}`}>
        <div
          className={`${heightStyles[size] || heightStyles.md} rounded-full transition-all duration-700 ease-out shadow-sm ${
            colorStyles[color] || colorStyles.emerald
          }`}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBarLogic;

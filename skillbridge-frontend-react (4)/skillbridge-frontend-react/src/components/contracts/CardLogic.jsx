/**
 * @file CardLogic.jsx
 * @description Logic wrapper & modern presentation for Card components.
 * Manages card click, stopPropagation for child interactives, and Figma surface styling.
 */
import React, { useCallback } from "react";

export function CardLogic({
  onClick = null,
  children,
  variant = "default", // default | surface | elevated | bordered | glow
  renderCard,
  className = "",
  id,
  ...restProps
}) {
  const isClickable = Boolean(onClick);

  const handleCardClick = useCallback(
    (e) => {
      if (typeof onClick === "function") {
        onClick(e);
      }
    },
    [onClick]
  );

  const stopPropagation = useCallback((e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  }, []);

  const variantStyles = {
    default:
      "bg-[#13161e] border border-[#222634] text-white shadow-md shadow-black/20",
    surface:
      "bg-[#181b24] border border-[#262c3d] text-white",
    elevated:
      "bg-[#13161e] border border-[#2a2f42] text-white shadow-xl shadow-black/40 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300",
    bordered:
      "bg-[#0f1117] border border-[#2e3446] text-white",
    glow:
      "bg-[#13161e] border border-emerald-500/30 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300"
  };

  const interactiveStyle = isClickable
    ? "cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200"
    : "";

  const computedClassName = `rounded-2xl p-6 relative overflow-hidden ${
    variantStyles[variant] || variantStyles.default
  } ${interactiveStyle} ${className}`;

  const logicProps = {
    id,
    isClickable,
    onClick: handleCardClick,
    stopPropagation,
    className: computedClassName,
    children,
    ...restProps
  };

  if (typeof renderCard === "function") {
    return renderCard(logicProps);
  }

  return (
    <div
      id={id}
      onClick={isClickable ? handleCardClick : undefined}
      className={computedClassName}
      {...restProps}
    >
      {children}
    </div>
  );
}

export default CardLogic;

/**
 * @file ButtonLogic.jsx
 * @description Logic contract & modern UI presentation for SkillBridge Button component.
 * Prevents double-submitting when `isLoading` or `isDisabled` is active, and applies
 * Figma design system styles.
 */
import React, { useCallback } from "react";

export function ButtonLogic({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
  children,
  type = "button",
  variant = "primary", // primary (emerald gradient) | secondary (dark card) | blue (royal blue) | danger | ghost | outline
  size = "md", // sm | md | lg
  renderButton,
  className = "",
  id,
  ...restProps
}) {
  const handleClick = useCallback(
    (e) => {
      if (isLoading || isDisabled) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        return;
      }
      onClick(e);
    },
    [isLoading, isDisabled, onClick]
  );

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl font-bold",
    lg: "px-7 py-3.5 text-base rounded-2xl font-extrabold"
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:brightness-105 active:scale-[0.98]",
    secondary:
      "bg-[#13161e] text-white border border-[#222634] hover:bg-[#1e2330] hover:border-emerald-500/50 active:scale-[0.98]",
    blue:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:brightness-105 active:scale-[0.98]",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 hover:brightness-105 active:scale-[0.98]",
    ghost:
      "bg-transparent text-gray-300 hover:text-white hover:bg-white/5 active:scale-[0.98]",
    outline:
      "bg-transparent text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 active:scale-[0.98]"
  };

  const baseStyle =
    "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none";

  const computedClassName = `${baseStyle} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.primary
  } ${className}`;

  const logicProps = {
    id,
    onClick: handleClick,
    disabled: isDisabled || isLoading,
    isLoading,
    isDisabled,
    type,
    variant,
    size,
    className: computedClassName,
    children,
    ...restProps
  };

  if (typeof renderButton === "function") {
    return renderButton(logicProps);
  }

  return (
    <button
      id={id}
      type={type}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      className={computedClassName}
      {...restProps}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}

export default ButtonLogic;

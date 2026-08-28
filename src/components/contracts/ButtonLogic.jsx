/**
 * @file ButtonLogic.jsx
 * @description Logic contract for Button component. Prevents double-clicking/multiple submits
 * when `isLoading` or `isDisabled` is active.
 */
import React, { useCallback } from "react";

export function ButtonLogic({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
  children,
  type = "button",
  renderButton,
  ...restProps
}) {
  const handleClick = useCallback(
    (e) => {
      // Prevent execution if already loading or disabled
      if (isLoading || isDisabled) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        return;
      }
      onClick(e);
    },
    [isLoading, isDisabled, onClick]
  );

  const logicProps = {
    onClick: handleClick,
    disabled: isDisabled || isLoading,
    isLoading,
    isDisabled,
    type,
    children,
    ...restProps
  };

  if (typeof renderButton === "function") {
    return renderButton(logicProps);
  }

  return logicProps;
}

export default ButtonLogic;

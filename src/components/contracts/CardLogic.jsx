/**
 * @file CardLogic.jsx
 * @description Logic wrapper for Card components.
 * Manages card click and provides stopPropagation helper for interactive child elements.
 */
import React, { useCallback } from "react";

export function CardLogic({
  onClick = null,
  children,
  renderCard,
  ...restProps
}) {
  const handleCardClick = useCallback(
    (e) => {
      if (typeof onClick === "function") {
        onClick(e);
      }
    },
    [onClick]
  );

  // Helper utility to attach to inner buttons/links to prevent card bubbling
  const stopPropagation = useCallback((e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  }, []);

  const logicProps = {
    isClickable: Boolean(onClick),
    onClick: handleCardClick,
    stopPropagation,
    children,
    ...restProps
  };

  if (typeof renderCard === "function") {
    return renderCard(logicProps);
  }

  return logicProps;
}

export default CardLogic;

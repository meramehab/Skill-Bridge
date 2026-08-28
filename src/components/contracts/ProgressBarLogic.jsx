/**
 * @file ProgressBarLogic.jsx
 * @description Logic contract for Progress Bar. Clamps progress percentage between 0 and 100.
 */
import React, { useMemo } from "react";
import { clamp } from "../../utils/asyncUtils";

export function ProgressBarLogic({ value = 0, label = "", renderProgressBar }) {
  const percentage = useMemo(() => {
    return clamp(value, 0, 100);
  }, [value]);

  const logicProps = {
    percentage,
    formattedPercentage: `${percentage}%`,
    label,
    isComplete: percentage === 100
  };

  if (typeof renderProgressBar === "function") {
    return renderProgressBar(logicProps);
  }

  return logicProps;
}

export default ProgressBarLogic;

/**
 * @file FooterLogic.jsx
 * @description Logic contract for Footer, handling newsletter email input and submission validation.
 */
import React, { useState, useCallback } from "react";
import { validateAuthField } from "../../utils/validation/authValidators";

export function FooterLogic({ onSubscribe = () => {}, renderFooter }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    setError(null);
    setIsSuccess(false);
  }, []);

  const handleSubscribe = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      const validationError = validateAuthField("email", email);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await onSubscribe(email);
        setIsSuccess(true);
        setEmail("");
      } catch (err) {
        setError("تعذر الاشتراك في النشرة الإخبارية.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, onSubscribe]
  );

  const logicProps = {
    email,
    error,
    isSubmitting,
    isSuccess,
    handleEmailChange,
    handleSubscribe
  };

  if (typeof renderFooter === "function") {
    return renderFooter(logicProps);
  }

  return logicProps;
}

export default FooterLogic;

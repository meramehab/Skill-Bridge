/**
 * @file ModalLogic.jsx
 * @description Logic contract for Modal / Dialog components.
 * Manages body scroll locking, Escape key listener, overlay click, and basic focus trapping.
 */
import React, { useEffect, useRef, useCallback } from "react";

export function ModalLogic({
  isOpen = false,
  onClose = () => {},
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  renderModal
}) {
  const modalContentRef = useRef(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Auto focus first interactive element on open
  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      const focusable = modalContentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      }
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  const logicProps = {
    isOpen,
    onClose,
    handleOverlayClick,
    modalContentRef,
    children
  };

  if (!isOpen) return null;

  if (typeof renderModal === "function") {
    return renderModal(logicProps);
  }

  return logicProps;
}

export default ModalLogic;

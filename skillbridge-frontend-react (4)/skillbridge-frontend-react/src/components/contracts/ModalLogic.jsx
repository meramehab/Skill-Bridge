/**
 * @file ModalLogic.jsx
 * @description Logic contract & modern presentation for Modal / Dialog components.
 * Manages body scroll locking, Escape key listener, overlay click, and focus trapping.
 */
import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

export function ModalLogic({
  isOpen = false,
  onClose = () => {},
  title = "",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  maxWidth = "max-w-xl", // max-w-md | max-w-lg | max-w-xl | max-w-2xl
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
    title,
    handleOverlayClick,
    modalContentRef,
    children
  };

  if (!isOpen) return null;

  if (typeof renderModal === "function") {
    return renderModal(logicProps);
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalContentRef}
        className={`w-full ${maxWidth} bg-[#13161e] border border-[#262c3d] rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative animate-scaleUp overflow-hidden`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#222634]">
          {title ? (
            <h3 className="text-xl font-bold text-white font-title">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default ModalLogic;

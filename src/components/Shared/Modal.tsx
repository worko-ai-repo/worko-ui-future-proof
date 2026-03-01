import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  className = "",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Open/close handler
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setIsAnimatingOut(false);
    } else if (visible) {
      setIsAnimatingOut(true);
      // Wait for animation to finish before fully hiding
      const timer = setTimeout(() => {
        setVisible(false);
        setIsAnimatingOut(false);
      }, 300); // match slide-out duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // No need for document-wide outside click when using explicit overlay

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9998]">
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isAnimatingOut ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={modalRef}
        className={`fixed top-0 right-0 z-[9999] max-h-[95vh] p-6 pt-0 bg-white rounded-xl shadow-lg ${
          isAnimatingOut ? "animate-slide-out" : "animate-slide-in"
        }`}
        style={{ overflowY: "auto" }}>
        {showCloseButton && (
          <div className="absolute top-0 right-0 w-fit bg-white z-10 pt-0 pr-2 flex justify-end">
            <button
              className="text-xl text-gray-500 hover:text-gray-800"
              onClick={onClose}
              aria-label="Close modal"
              title="Close modal">
              ×
            </button>
          </div>
        )}
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div className={`${className}`}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

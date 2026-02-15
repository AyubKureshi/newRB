import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const Alert = ({ message = "", type = "error", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  if (!isVisible) return null;

  const colorStyles =
    type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-green-100 border-green-400 text-green-700";

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300">
      <div
        className={`flex items-center justify-between min-w-[320px] p-4 border-l-4 rounded shadow-2xl ${colorStyles} animate-in fade-in slide-in-from-top-4`}
      >
        <span className="text-sm font-semibold">{message}</span>

        <button
          onClick={handleClose}
          className="ml-4 p-1 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Alert;

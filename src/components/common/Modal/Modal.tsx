import { ReactNode } from "react";
import ScreenLoader from "../ScreenLoader/ScreenLoader";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string;
  loading?: boolean;
  showHeader?: boolean;
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-xl",
  loading,
  showHeader = true,
}: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className={`relative w-full ${widthClass} rounded-2xl bg-white shadow-2xl border border-[#e7f1fa]`}>
        {showHeader ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef4fb]">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close"
          >
            ×
          </button>
        )}
        <div className="p-6 relative">
          {children}
          {loading && <ScreenLoader zClass="z-[70]" />}
        </div>
      </div>
    </div>
  );
};

export default Modal;

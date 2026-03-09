
type ConfirmationModalProps = {
  isOpen: boolean;
  toothNumber: number | string;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  isOpen,
  toothNumber,
  onClose,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-900">
            Added Implants Restoration for{" "}
            <span className="text-blue-600 font-medium">
              {toothNumber}
            </span>
          </p>

          <p className="text-sm text-gray-700">
            Does Need Anything Else?
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onCancel}
              className="
                h-10
                px-4
                rounded-lg
                border
                border-gray-300
                text-sm
                text-gray-700
                hover:bg-gray-100
              "
            >
              Yes, Need
            </button>

            <button
              onClick={onConfirm}
              className="
                h-10
                px-4
                rounded-lg
                bg-blue-600
                text-sm
                text-white
                hover:bg-blue-700
              "
            >
              No, It&apos;s Perfect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

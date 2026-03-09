import { X } from "lucide-react";

interface SwitchToOverdentureModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const SwitchToOverdentureModal = ({
    isOpen,
    onConfirm,
    onCancel,
}: SwitchToOverdentureModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 mx-4 relative">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="flex flex-col space-y-6 pt-4">
                    <div>
                        <h3 className="text-2xl font-semibold">
                            <span className="text-gray-800">You're now ordering an </span>
                            <span className="text-red-500">Overdenture</span>
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                            We'll tailor the questions for overdentures. Please confirm you'd like to continue.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                        >
                            Order an Overdenture
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

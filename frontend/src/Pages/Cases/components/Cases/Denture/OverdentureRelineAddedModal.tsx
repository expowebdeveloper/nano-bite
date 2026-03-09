import { Edit, ArrowRight } from "lucide-react";

interface OverdentureRelineAddedModalProps {
    isOpen: boolean;
    patientName?: string;
    onStartScanning: () => void;
    onAddAnotherItem?: () => void;
    onEdit?: () => void;
}

export const OverdentureRelineAddedModal = ({
    isOpen,
    patientName = "Training",
    onStartScanning,
    onAddAnotherItem,
    onEdit,
}: OverdentureRelineAddedModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 mx-4 relative">
                <div className="flex flex-col items-center text-center space-y-6 pt-4">
                    {/* Denture Icon */}
                    <div className="w-20 h-20 flex items-center justify-center">
                        <span className="text-6xl">🦷</span>
                    </div>

                    {/* Title */}
                    <div>
                        <h3 className="text-2xl font-semibold text-[#0B75C9]">
                            Added Overdenture Reline
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                            We recommend taking {patientName.toUpperCase()}'S impression and scanning extraorally
                        </p>
                    </div>

                    {/* Start Scanning Button */}
                    <button
                        onClick={onStartScanning}
                        className="w-full bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] hover:shadow-lg text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <span>Start scanning</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Add Another Item Link */}
                    {onAddAnotherItem && (
                        <button
                            onClick={onAddAnotherItem}
                            className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                        >
                            Add another item
                        </button>
                    )}

                    {/* Edit Link */}
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="text-[#0B75C9] font-medium flex items-center gap-2 hover:underline"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Overdenture Reline
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

import { Check, Edit, ArrowRight } from "lucide-react";

interface AddedItemModalProps {
    isOpen: boolean;
    itemName: string;
    itemNameColor?: string; // Color for the item name (e.g., "red" for Partial)
    patientName?: string;
    onStartScanning: () => void;
    onAddAnotherItem?: () => void;
    onEdit?: () => void;
    editLabel?: string;
}

export const AddedItemModal = ({
    isOpen,
    itemName,
    itemNameColor = "text-[#004d40]",
    patientName = "Training",
    onStartScanning,
    onAddAnotherItem,
    onEdit,
    editLabel = "Edit",
}: AddedItemModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 mx-4 relative">
                {/* Close buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={onStartScanning}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-6 pt-4">
                    {/* Icons */}
                    <div className="flex justify-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                        </div>
                        <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold">
                            <span className="text-gray-800">Added </span>
                            <span className={itemNameColor}>{itemName}</span>
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Does {patientName} need anything else?
                        </p>
                    </div>

                    <button
                        onClick={onStartScanning}
                        className="w-full bg-[#00a758] hover:bg-[#008f4b] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <span>Start scanning</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {onAddAnotherItem && (
                        <button
                            onClick={onAddAnotherItem}
                            className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                        >
                            Add another item
                        </button>
                    )}

                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="text-[#00a758] font-medium flex items-center gap-2 hover:underline"
                        >
                            <Edit className="w-4 h-4" />
                            {editLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

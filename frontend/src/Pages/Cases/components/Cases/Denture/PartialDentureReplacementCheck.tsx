import { UseFormReturn, Controller } from "react-hook-form";
import { CaseFormValues } from "../../../../../Constants/Constants";
import { CommanHeading } from "../../../CommanHeading";
import { Circle, Disc } from "lucide-react";
import { calculateDenturePrice, formValuesToPricingInput } from "../../../../../utils/denturePricing";

interface PartialDentureReplacementCheckProps {
    formConfig: UseFormReturn<CaseFormValues>;
}

export const PartialDentureReplacementCheck = ({
    formConfig,
}: PartialDentureReplacementCheckProps) => {
    const { control } = formConfig;
  // Show estimated pricing right in the Partial Denture flow.
  // Partial denture previously had no "review" step that displayed price details.
  const values = formConfig.watch();
  const pricing = (() => {
    try {
      const input = formValuesToPricingInput(values, "Partial Denture");
      return calculateDenturePrice(input);
    } catch {
      return { breakdown: [], rushFee: 0, rushLabel: "—", subtotal: 0, total: 0 };
    }
  })();

    return (
        <div className="bg-white p-6 md:p-8 space-y-6">
            <CommanHeading
                caseName="Adding a Partial"
                titleName="Is this a replacement partial?"
            />

            <div className="mt-8 max-w-2xl">
                <Controller
                    name="partialIsReplacement"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <div className="flex flex-col gap-4">
                            <div
                                onClick={() => onChange(true)}
                                className={`
                                    flex items-center gap-3 cursor-pointer
                                    px-8 py-6 rounded-lg border-2 transition-all
                                    ${value === true
                                        ? "border-[#0B75C9] bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }
                                `}
                            >
                                {value === true ? (
                                    <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="font-medium text-gray-900 text-lg">Yes</span>
                            </div>
                            <div
                                onClick={() => onChange(false)}
                                className={`
                                    flex items-center gap-3 cursor-pointer
                                    px-8 py-6 rounded-lg border-2 transition-all
                                    ${value === false
                                        ? "border-[#0B75C9] bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }
                                `}
                            >
                                {value === false ? (
                                    <Disc className="w-5 h-5 fill-[#0B75C9] text-[#0B75C9]" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="font-medium text-gray-900 text-lg">No</span>
                            </div>
                        </div>
                    )}
                />
            </div>

            {pricing.breakdown.length > 0 ? (
              <div className="rounded-2xl border border-[#d6e8f5] bg-[#f0f7ff] p-5 md:p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated lab fee</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {pricing.breakdown.map((line, i) => (
                    <div key={i} className="flex justify-between gap-4">
                      <span>{line.label}</span>
                      <span className="font-medium">${line.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t-2 border-[#2B89D2] mt-2">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 max-w-2xl">
                Select Partial Denture options to see the price details.
              </p>
            )}
        </div>
    );
};

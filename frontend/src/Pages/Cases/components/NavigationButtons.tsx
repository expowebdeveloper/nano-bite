import Button from "../../../components/common/Buttons/Button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
}: NavigationButtonsProps) => {
  // Show previous button: from step 2 onwards
  const showPrevious = currentStep > 1 && currentStep < totalSteps;

  // Show next button: on all steps except the last one
  const showNext = currentStep < totalSteps;

  // Show submit button: only on final step
  const showSubmit = currentStep === totalSteps;

  return (
    <div className="flex justify-center items-center gap-6 p-6 w-full z-10 fixed bottom-0 right-0 w-full max-w-[calc(100%-343px)]
     bg-white border-t border-gray-200">
      {showPrevious && (
        <Button
          btnType="button"
          btnText="Back"
          btnClick={onPrevious}
          customClass="w-[180px] h-[48px] rounded-lg border border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-50 transition-colors"
        />
      )}

      {showNext && (
        <Button
          btnType="button"
          btnText="Next"
          btnClick={onNext}
          customClass="w-[180px] h-[48px] rounded-lg bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white font-semibold hover:shadow-lg transition-shadow"
        />
      )}

      {showSubmit && (
        <Button
          btnType="submit"
          btnText={isSubmitting ? "Submitting..." : "Submit"}
          disable={isSubmitting}
          customClass="w-[180px] h-[48px] rounded-lg bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
        />
      )}
    </div>
  );
};

export default NavigationButtons;

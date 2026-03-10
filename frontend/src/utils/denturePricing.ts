/**
 * Practice Price Guide – denture design and rush fees.
 * Prices in USD.
 */

export const DENTURE_PRICES = {
  // Full Denture Design — $55 per arch (alt. $60)
  fullDenturePerArch: 55,

  // Partial Denture Design — per case
  partial: {
    Acrylic: 45,
    Flexible: 50,
    "Cast Metal": 75,
    Hybrid: 80,
    "Implant-assisted": 80,
  } as Record<string, number>,

  // Try-In / Setup
  monolithicTryInPerArch: 40,
  setupModification: 25,
  teethSetupModification: 25,

  // Optional Add-Ons
  digitalRelinePerArch: 35,
  implantOverdenturePerCase: 90,

  // Rush
  rush: {
    sameDay: 50,   // 0–24 hours
    nextDay: 25,   // 24–48 hours
    standard: 0,   // 48+ hours
  },
} as const;

export type RushTurnaround = "Same Day" | "Next Day" | "Standard";

export interface DenturePricingInput {
  /** "Full Denture" | "Overdenture" | "Partial Denture" */
  selectedOption?: string | null;
  /** "Dual arch" | "Single arch: upper" | "Single arch: lower" */
  dentureArch?: string;
  hasExistingDenture?: boolean;
  /** Overdenture: implant case */
  isOverdentureCase?: boolean;
  /** Overdenture reline: "Dual arch" | "Single arch: upper" | "Single arch: lower" */
  overdentureRelineArch?: string;
  /** Partial: ["Acrylic"] | ["Cast Metal"] etc. */
  partialType?: string[];
  /** Setup / modification add-ons (bite, midline, design preview, etc.) */
  hasSetupOrModification?: boolean;
  /** Due date ISO string to derive rush */
  dueDate?: string;
}

export interface PriceLine {
  label: string;
  amount: number;
}

export interface DenturePricingResult {
  breakdown: PriceLine[];
  rushFee: number;
  rushLabel: string;
  subtotal: number;
  total: number;
}

function getArchCount(arch?: string): number {
  if (!arch) return 0;
  if (arch.toLowerCase().includes("dual")) return 2;
  return 1;
}

export function getRushFromDueDate(dueDate?: string): { fee: number; label: string } {
  if (!dueDate) return { fee: DENTURE_PRICES.rush.standard, label: "Standard" };
  const now = new Date();
  const due = new Date(dueDate);
  const hoursFromNow = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursFromNow <= 24) return { fee: DENTURE_PRICES.rush.sameDay, label: "Same Day Rush (0-24 hours)" };
  if (hoursFromNow <= 48) return { fee: DENTURE_PRICES.rush.nextDay, label: "Next Day Rush (24-48 hours)" };
  return { fee: DENTURE_PRICES.rush.standard, label: "Standard Turnaround (48+ hours)" };
}

export function calculateDenturePrice(input: DenturePricingInput): DenturePricingResult {
  const breakdown: PriceLine[] = [];
  let subtotal = 0;

  const option = (input.selectedOption || "").trim();
  const archCount = getArchCount(input.dentureArch);
  const relineArchCount = getArchCount(input.overdentureRelineArch);

  // Full Denture
  if (option === "Full Denture" && archCount > 0) {
    const fullDentureAmount = archCount * DENTURE_PRICES.fullDenturePerArch;
    subtotal += fullDentureAmount;
    breakdown.push({
      label: `Full Denture Design (${input.dentureArch})`,
      amount: fullDentureAmount,
    });
  }

  // Overdenture
  if (option === "Overdenture" || input.isOverdentureCase) {
    const overdentureAmount = DENTURE_PRICES.implantOverdenturePerCase;
    subtotal += overdentureAmount;
    breakdown.push({
      label: "Implant Overdenture Design",
      amount: overdentureAmount,
    });
    if (relineArchCount > 0 && input.overdentureRelineArch) {
      const relineAmount = relineArchCount * DENTURE_PRICES.digitalRelinePerArch;
      subtotal += relineAmount;
      breakdown.push({
        label: "Digital Reline Design",
        amount: relineAmount,
      });
    }
  }

  // Partial Denture
  if (option === "Partial Denture" && input.partialType?.length) {
    const firstType = input.partialType[0];
    const price = firstType && DENTURE_PRICES.partial[firstType] != null
      ? DENTURE_PRICES.partial[firstType]
      : DENTURE_PRICES.partial.Acrylic;
    subtotal += price;
    breakdown.push({
      label: `${firstType || "Acrylic"} Partial Design`,
      amount: price,
    });
  }

  // Setup / modification (optional add-on)
  if (input.hasSetupOrModification) {
    subtotal += DENTURE_PRICES.setupModification;
    breakdown.push({
      label: "Setup Modification / Adjustment",
      amount: DENTURE_PRICES.setupModification,
    });
  }

  // Rush
  const { fee: rushFee, label: rushLabel } = getRushFromDueDate(input.dueDate);
  if (rushFee > 0) {
    breakdown.push({
      label: rushLabel,
      amount: rushFee,
    });
  }

  return {
    breakdown,
    rushFee,
    rushLabel,
    subtotal,
    total: subtotal + rushFee,
  };
}

/**
 * Maps CaseFormValues (or subset) to DenturePricingInput for the review step.
 */
export function formValuesToPricingInput(values: {
  dueDate?: string;
  dentureArch?: string;
  hasExistingDenture?: boolean;
  overdentureRelineArch?: string;
  overdentureImplantLocations?: unknown[];
  partialType?: string[];
  dentureBiteAdjustment?: string;
  dentureMidlineCorrection?: string;
  dentureWantsDesignPreview?: boolean;
  dentureDesignPreviewAddOns?: string[];
  dentureOtherDetails?: string[];
}, selectedOption?: string | null): DenturePricingInput {
  const hasModification =
    (values.dentureBiteAdjustment && values.dentureBiteAdjustment !== "Leave as is") ||
    (values.dentureMidlineCorrection && values.dentureMidlineCorrection !== "Leave as is") ||
    (values.dentureWantsDesignPreview === true) ||
    (values.dentureDesignPreviewAddOns && values.dentureDesignPreviewAddOns.length > 0) ||
    (values.dentureOtherDetails && values.dentureOtherDetails.length > 0);

  return {
    selectedOption: selectedOption ?? undefined,
    dentureArch: values.dentureArch,
    hasExistingDenture: values.hasExistingDenture,
    isOverdentureCase: selectedOption === "Overdenture" && (values.overdentureImplantLocations?.length ?? 0) > 0,
    overdentureRelineArch: values.overdentureRelineArch || undefined,
    partialType: values.partialType,
    hasSetupOrModification: hasModification,
    dueDate: values.dueDate || undefined,
  };
}

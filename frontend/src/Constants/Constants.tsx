import { Banknote, Calendar, Edit, LayoutDashboard, MessageSquareMore, Settings, ShieldCheck, Users } from "lucide-react";
import { ValidationRule } from "../interfaces/interfaces";

export const BUTTON_TYPE = {
  button: "button",
  submit: "submit",
} as const;

export const TOAST_MESSAGE_TYPE = {
  error: "error",
  success: "success",
};
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;

export const passwordRules: ValidationRule = {
  required: "Password is required",

  pattern: {
    value: PASSWORD_REGEX,
    message: "Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
  },

  validate: (value: string) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (value.length > 16) {
      return "Password must not exceed 16 characters";
    }
    return true;
  },
};
export const ITEMS_PER_PAGE = 10;

// Cases form option sets
export const SEX_OPTIONS = ["M", "F", "Other"] as const;
export const BRUXISM_OPTIONS = ["None", "Mild", "Moderate", "Severe"] as const;
export const SMILE_STYLE_OPTIONS = ["Natural", "Enhanced", "White"] as const;
export const MIDLINE_OPTIONS = ["Facial", "Existing"] as const;
export const PHOTO_OPTIONS = [
  "Full Face Smile",
  "Retracted Frontal",
  "Lateral Left",
  "Lateral Right",
  "Occlusal Maxillary",
  "Occlusal Mandibular",
] as const;
export const SCAN_OPTIONS = [
  "Max Arch IOS",
  "Mand Arch IOS",
  "Bite Scan",
  "Pre-op Scan",
  "CBCT",
  "Existing Prosthesis Scan",
] as const;


// Case type step option sets
export const CASE_TYPE_OPTIONS = [
  "Single Crown / Onlay / Veneer",
  "Short-span Bridge",
  "Implant Crown / Implant Bridge",
  "Full Arch Implant Fixed",
  "Digital Complete Denture",
  "Partial Denture",
] as const;

export const SHADE_NOTES = [
  "Bisceration",
  "Margin?",
  "Super Gingival",
  "Equal",
  "Unequal",
  "Emergence Profile",
  "Moderate",
  "Deep",
  "Over Contour",
  "Under Contour",
] as const;

export const BRIDGE_CONTACTS = ["Contact", "Occlusion", "Maxillary", "Mandibular"] as const;
export const IMPLANT_ABUTMENT_TYPES = [
  "Emergence Profile",
  "Moderate",
  "Deep",
  "Over Contour",
  "Under Contour",
] as const;
export const FULL_ARCH_ITEMS = ["Provisional", "Final", "Primary", "Secondary"] as const;
export const DIGITAL_DENTURE_ITEMS = ["Try-in", "Final"] as const;
export const PARTIAL_DENTURE_ITEMS = ["Try-in", "Final"] as const;

// Case type (Single Crown / Onlay / Veneer) option sets
export const RESTORATION_TYPES = ["Crown", "Onlay", "Veneer"] as const;
export const MATERIAL_OPTIONS = [
  "Zirconia (Mono)",
  "Zirconia (Layered)",
  "e.max",
  "Hybrid",
] as const;
export const RESTORATION_PREP_OPTIONS = ["Chamfer", "Shoulder", "Deep areas"] as const;
export const CONTACT_OPTIONS = ["Light", "Normal", "Tight"] as const;
export const OCCLUSION_OPTIONS = ["Maintain existing", "Lighten MI", "No excursive contact"] as const;
export const REQUIRED_SCAN_OPTIONS = ["Pre-op", "Prep arch", "Opposing", "Bite", "Shade photos"] as const;

// Short-span bridge options
export const PONTIC_DESIGN_STD = ["Modified Ridge Lap (std)", "Ovate (depth ___ mm)", "Hygienic"] as const;
export const PONTIC_CONTACT_OPTIONS = ["Light", "Normal", "Tight"] as const;
export const BRIDGE_MATERIAL_OPTIONS = ["Zirconia Mono", "Zirconia Layered", "e.max", "PFM"] as const;
export const BRIDGE_REQUIRED_SCANS = ["Pre", "Op", "Prep arch", "Opposing", "Bite", "Ridge scan"] as const;

// Implant crown / bridge options
export const IMPLANT_RESTORATION_OPTIONS = [
  "Screw-retained",
  "Cement-retained (Stock/Custom)",
] as const;
export const EMERGENCE_OPTIONS = ["Follow provisional", "Slim", "Normal", "Bulky"] as const;
export const IMPLANT_REQUIRED_SCANS = [
  "Full arch w/ scan body",
  "Opposing",
  "Bite",
  "Provisional scan",
  "Radiograph of scan body",
] as const;
export const IMPLANT_ABUTMENT_OPTIONS = ["Titanium", "Zirconia", "Ti-base"] as const;
export const IMPLANT_OCCLUSION_OPTIONS = ["Light MI", "No excursive contacts", "ASC"] as const;
export const IMPLANT_ALLOWED_OPTIONS = ["Yes", "No"] as const;

// Full Arch Implant Fixed options
export const FULL_ARCH_DESIGN = ["FP1", "FP2", "FP3 Hybrid"] as const;
export const FULL_ARCH_FRAMEWORK = ["Zirconia", "Titanium", "Co", "Cr"] as const;
export const FULL_ARCH_VDO = ["Current prosthesis", "New record"] as const;
export const FULL_ARCH_OCCLUSION = ["Group", "Canine", "Balanced"] as const;
export const FULL_ARCH_TOOTH_SIZE = ["Small", "Medium", "Large"] as const;
export const FULL_ARCH_GINGIVA = ["Show", "Hide"] as const;
export const FULL_ARCH_MIDLINE = ["Facial", "Existing"] as const;
export const FULL_ARCH_REQUIRED_SCANS = [
  "Full arch w/ scan bodies",
  "Opposing",
  "Buccal bites",
  "Try",
  "In scan",
  "CBCT",
] as const;
export const FULL_ARCH_REQUIRED_SCANS_TOP = ["Maxilla", "Mandible"] as const;

// Digital Complete Denture options
export const DIGITAL_DENTURE_TYPE = ["Conventional", "Immediate", "Copy Denture"] as const;
export const DIGITAL_DENTURE_ARCH = ["Maxilla", "Mandible", "Both"] as const;
export const DIGITAL_DENTURE_VDO = ["Existing dentures", "New record"] as const;
export const DIGITAL_DENTURE_TOOTH_SETUP = ["Small", "Medium", "Large"] as const;
export const DIGITAL_DENTURE_BASE = ["Full extension", "Reduced", "Horseshoe (upper)"] as const;
export const DIGITAL_DENTURE_COPY = ["Duplicate exactly", "Changes"] as const;
export const DIGITAL_DENTURE_REQUIRED_SCANS = [
  "Edentulous arch",
  "Opposing",
  "Bite",
  "Denture scan (if copy)",
] as const;

// Partial Denture options
export const PARTIAL_TYPES = ["Cast Metal", "Flexible", "Acrylic", "Implant-assisted"] as const;
export const PARTIAL_FRAMEWORK = ["Co", "Cr", "Titanium"] as const;
export const PARTIAL_REQUIRED_SCANS = ["Arch scan", "Opposing", "Bite", "Existing partial (if rework)"] as const;
export const PARTIAL_AESTHETICS = ["Min metal display"] as const;

// Case Form Types
export type CaseFormValues = {
  // Header
  caseType: string;
  doctorSignature: string;
  date: string;
  // Patient Information
  patientName: string;
  age: string;
  sex: string[];
  dueDate: string;
  bruxism: string[];
  smileStyle: string[];
  midline: string[];
  estheticNotes: string;
  photos: string[];
  scans: string[];
  additionalNotes: string;
  // Single Crown / Onlay / Veneer
  toothType: string;
  finalShade: string;
  stumpShade: string;
  restorationTypes: string[];
  materialOptions: string[];
  restorationPrep: string[];
  noted: string;
  contacts: string[];
  occlusion: string[];
  requiredScans: string[];
  // Short-span bridge
  abutmentsLeft: string;
  abutmentsRight: string;
  ponticDesign: string[];
  ponticContacts: string[];
  ponticTeeth: string;
  bridgeMaterial: string[];
  bridgeRequiredScans: string[];
  // Implant crown/bridge
  implantBrand: string;
  implantPlatform: string;
  implantConnection: string;
  implantTooth: string;
  implantRestoration: string[];
  implantEmergence: string[];
  implantRequiredScans: string[];
  implantAbutment: string[];
  implantOcclusion: string[];
  implantAllowed: string[];
  // Full Arch Implant Fixed
  fullArchDesign: string[];
  fullArchFramework: string[];
  fullArchVdo: string[];
  fullArchOcc: string[];
  fullArchToothSize: string[];
  fullArchGingiva: string[];
  fullArchMidline: string[];
  fullArchRequiredScansTop: string[];
  fullArchRequiredScans: string[];
  // Digital Complete Denture
  digitalType: string[];
  digitalArch: string[];
  digitalVdo: string[];
  digitalToothSetup: string[];
  digitalShade: string;
  digitalBase: string[];
  digitalCopy: string[];
  digitalRequiredScans: string[];
  digitalNewRecord: string;
  digitalChanges: string;
  // Partial denture
  partialType: string[];
  partialFramework: string[];
  partialMajorConnector: string;
  partialRests: string;
  partialShade: string;
  partialClasps: string;
  partialBaseAreas: string;
  partialAesthetics: string[];
  partialRequiredScans: string[];
};

// Case Form Default Values
export const CASE_FORM_DEFAULT_VALUES: CaseFormValues = {
  // Header
  caseType: "Single Crown / Onlay / Veneer",
  doctorSignature: "",
  date: "",
  // Patient Information
  patientName: "",
  age: "",
  sex: [],
  dueDate: "",
  bruxism: [],
  smileStyle: [],
  midline: [],
  estheticNotes: "",
  photos: [],
  scans: [],
  additionalNotes: "",
  // Single Crown / Onlay / Veneer
  toothType: "",
  finalShade: "",
  stumpShade: "",
  restorationTypes: [],
  materialOptions: [],
  restorationPrep: [],
  noted: "",
  contacts: [],
  occlusion: [],
  requiredScans: [],
  // Short-span bridge
  abutmentsLeft: "",
  abutmentsRight: "",
  ponticDesign: [],
  ponticContacts: [],
  ponticTeeth: "",
  bridgeMaterial: [],
  bridgeRequiredScans: [],
  // Implant crown/bridge
  implantBrand: "",
  implantPlatform: "",
  implantConnection: "",
  implantTooth: "",
  implantRestoration: [],
  implantEmergence: [],
  implantRequiredScans: [],
  implantAbutment: [],
  implantOcclusion: [],
  implantAllowed: [],
  // Full Arch Implant Fixed
  fullArchDesign: [],
  fullArchFramework: [],
  fullArchVdo: [],
  fullArchOcc: [],
  fullArchToothSize: [],
  fullArchGingiva: [],
  fullArchMidline: [],
  fullArchRequiredScansTop: [],
  fullArchRequiredScans: [],
  // Digital Complete Denture
  digitalType: [],
  digitalArch: [],
  digitalVdo: [],
  digitalToothSetup: [],
  digitalShade: "",
  digitalBase: [],
  digitalCopy: [],
  digitalRequiredScans: [],
  digitalNewRecord: "",
  digitalChanges: "",
  // Partial denture
  partialType: [],
  partialFramework: [],
  partialMajorConnector: "",
  partialRests: "",
  partialShade: "",
  partialClasps: "",
  partialBaseAreas: "",
  partialAesthetics: [],
  partialRequiredScans: [],
};



// Export the typed array
export const SIDE_BAR_ITEMS = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: () => <LayoutDashboard className="w-5 h-5" />,
    allowedRoles: ["ADMIN", "Dentist", "Designer", "QC"],
  },
  {
    name: "Quality Control",
    url: "/quality-control",
    icon: () => <ShieldCheck className="w-5 h-5" />,
    allowedRoles: ["ADMIN"],
  },
  {
    name: "Users",
    url: "/users",
    icon: () => <Users className="w-5 h-5" />,
    allowedRoles: ["ADMIN"],
  },
  {
    name: "Cases",
    url: "/cases",
    icon: () => <Edit className="w-5 h-5" />,
    allowedRoles: ["ADMIN", "Dentist", "Designer", "QC"],
  },
  {
    name: "Messages",
    url: "/messages",
    icon: () => <MessageSquareMore className="w-5 h-5" />,
    allowedRoles: ["ADMIN", "Dentist", "Designer", "QC"],
  },
  {
    name: "Calendar",
    url: "/calendar",
    icon: () => <Calendar className="w-5 h-5" />,
    allowedRoles: ["ADMIN", "Dentist", "Designer", "QC"],
  },
  {
    name: "Payments",
    url: "/payments",
    icon: () => <Banknote className="w-5 h-5" />,
    allowedRoles: ["ADMIN"],
  },
  {
    name: "Setting",
    url: "/setting",
    icon: () => <Settings className="w-5 h-5" />,
    allowedRoles: ["ADMIN", "Dentist", "Designer", "QC"],
  },
];
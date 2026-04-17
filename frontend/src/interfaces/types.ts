import type { User } from "./interfaces";

export type Login = {
    email: string;
    password: string;
  }
  
  export type LoginResponse = {
    user: User;
    message: string;
    access_token: string;
  };
  
  export type ResetPasswordRequest = {
    email: string;
  };
  
  export type ResetPasswordResponse = {
    message: string;
  };

  // Signup related types
  export interface DentistSignupPayload {
    fullName: string;
    email: string;
    phone_number: string;
    address: string;
    state: string;
    city: string;
    country: string;
    zipCode: string;
    password: string;
    role: string;
    dentistProfile: {
      licenseNumber: string;
      preferredContactMethod: string[];
      specialty: string[];
    };
    teamDetails: {
      assistantName: string;
      assistantPhone: string;
      officeManager: string;
      officeManagerPhone: string;
      whoApprovesDesigns: string;
      contactTimeWindow: string;
      standardOcclusalPreference: string;
      standardShadesUsed: string;
    };
    clinicInfo: {
      clinicName: string;
      clinicPhone: string;
      clinicAddress: string;
      clinicCountry?: string;
      clinicState: string;
      clinicCity: string;
      zipcode: string;
      scannerType: string;
      preferredFileTransfer: string[];
    };
  }

  export interface TeamContactsFormValues {
    assistantName: string;
    assistantPhone: string;
    officeManager: string;
    officeManagerPhone: string;
    whoApprovesDesigns: string;
    contactTimeWindow: string;
    standardOcclusalPreference: string;
    standardShadesUsed: string;
  }

  export type CaseAttachmentType = "stl" | "photo" | "pdf" | "prescription" | "archive";

  export interface CaseAttachment {
    type: CaseAttachmentType;
    name: string;
    mime: string;
    size: number;
    key: string;
    url?: string;
  }

  export interface DentistProfilePayload {
    licenseNumber?: string | null;
    assistantName?: string | null;
    assistantPhone?: string | null;
    officeManager?: string | null;
    officeManagerPhone?: string | null;
    whoApprovesDesigns?: string | null;
    contactTimeWindow?: string | null;
    standardOcclusalPreference?: string | null;
    standardShadesUsed?: string | null;
    clinicName?: string | null;
    clinicPhone?: string | null;
    clinicAddress?: string | null;
    clinicCountry?: string | null;
    clinicState?: string | null;
    clinicCity?: string | null;
    zipcode?: string | null;
    scannerType?: string | null;
    preferredContactMethod?: string[];
    specialty?: string[];
    preferredFileTransfer?: string[];
  }

  export interface UserProfile extends DentistProfilePayload {
    id?: string;
    email: string;
    fullName: string;
    phone_number?: string;
    address?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    role?: string;
    createdAt?: string;
    dentistProfile?: DentistProfilePayload | null;
  }

  export interface CaseRecord {
    id: string;
    caseId: string;
    status: string;
    isPaid?: boolean;
    payments?: Array<{
      id?: string;
      invoiceId?: string | null;
      invoiceUrl?: string | null;
      createdAt?: string;
    }>;
    caseType?: string;
    doctorSignature?: string;
    date?: string;
    patientName?: string;
    age?: string;
    sex?: string[];
    dueDate?: string;
    bruxism?: string[];
    smileStyle?: string[];
    midline?: string[];
    estheticNotes?: string;
    photos?: string[];
    scans?: string[];
    occlusion?: string[];
    requiredScans?: string[];
    additionalNotes?: string;
    attachments?: CaseAttachment[];
    cloudFolderLink?: string | null;
    toothType?: string;
    finalShade?: string;
    stumpShade?: string;
    restorationTypes?: string[];
    materialOptions?: string[];
    restorationPrep?: string[];
    noted?: string;
    contacts?: string[];
    abutmentsLeft?: string;
    abutmentsRight?: string;
    ponticDesign?: string[];
    ponticContacts?: string[];
    ponticTeeth?: string;
    bridgeMaterial?: string[];
    bridgeRequiredScans?: string[];
    implantBrand?: string;
    implantPlatform?: string;
    implantConnection?: string;
    implantTooth?: string;
    implantRestoration?: string[];
    implantEmergence?: string[];
    implantRequiredScans?: string[];
    implantAbutment?: string[];
    implantOcclusion?: string[];
    implantAllowed?: string[];
    fullArchDesign?: string[];
    fullArchFramework?: string[];
    fullArchVdo?: string[];
    fullArchOcc?: string[];
    fullArchToothSize?: string[];
    fullArchGingiva?: string[];
    fullArchMidline?: string[];
    fullArchRequiredScansTop?: string[];
    fullArchRequiredScans?: string[];
    digitalType?: string[];
    digitalArch?: string[];
    digitalVdo?: string[];
    digitalToothSetup?: string[];
    digitalShade?: string;
    digitalBase?: string[];
    digitalCopy?: string[];
    digitalRequiredScans?: string[];
    digitalNewRecord?: string;
    digitalChanges?: string;
    // Denture (Full / Conventional)
    hasExistingDenture?: boolean;
    isExactCopy?: boolean;
    isImplantSupported?: boolean;
    dentureArch?: string;
    dentureBaseShade?: string;
    dentureTissueShade?: string;
    dentureKind?: string;
    dentureSmileStyle?: string;
    dentureFestooningLevel?: string;
    dentureWantsAddOns?: boolean;
    dentureHasDiastema?: boolean;
    dentureDiastemaHandling?: string;
    dentureAddOns?: string[];
    dentureBiteAdjustment?: string;
    dentureMidlineCorrection?: string;
    dentureOtherDetails?: string[];
    dentureWantsDesignPreview?: boolean;
    dentureReviewOptions?: string[];
    dentureDesignPreviewAddOns?: string[];
    dentureRxInstructions?: string;
    // Overdenture
    overdentureScanMethod?: string;
    overdentureSupportType?: string;
    overdentureImplantLocations?: number[];
    overdentureImplantManufacturer?: string;
    overdentureImplantSystem?: string;
    overdentureImplantPlatformSize?: string;
    overdentureImplantCuffHeight?: string;
    overdentureUseSameImplantSystem?: boolean;
    overdentureRelineArch?: string;
    // Partial denture
    partialType?: string[];
    partialFramework?: string[];
    partialMajorConnector?: string;
    partialRests?: string;
    partialShade?: string;
    partialClasps?: string;
    partialBaseAreas?: string;
    partialAesthetics?: string[];
    partialRequiredScans?: string[];
    partialIsReplacement?: boolean;
    partialMaterial?: string;
    partialBaseShade?: string;
    partialTissueShade?: string;
    qcComment?: string;
    createdAt?: string;
    updatedAt?: string;
    createdById?: string | null;
    createdBy?: {
      id: string;
      fullName?: string;
      email?: string;
    } | null;
    assignedToDesigner?: {
      id: string;
      fullName?: string;
      email?: string;
      role?: string;
    } | null;
    assignedToQc?: {
      id: string;
      fullName?: string;
      email?: string;
      role?: string;
    } | null;
  }
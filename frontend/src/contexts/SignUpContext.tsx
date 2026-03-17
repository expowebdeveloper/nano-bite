import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SignUpFormData {
  // Step 1: Basic Information
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  role: string;
  preferredContactMethod: string[];
  specialty: string[];
  address: string;
  state: string;
  city: string;
  country: string;
  password: string;

  // Step 2: Clinic Information
  clinicName: string;
  clinicPhone: string;
  clinicAddress: string;
  clinicCountry: string;
  clinicState: string;
  clinicCity: string;
  zipcode: string;
  scannerType: string;
  preferredFileTransfer: string[];

  // Step 3: Team Contacts
  assistantName: string;
  assistantPhone: string;
  officeManager: string;
  officeManagerPhone: string;
  whoApprovesDesigns: string;
  contactTimeWindow: string;
  standardOcclusalPreference: string;
  standardShadesUsed: string;
}

interface SignUpContextType {
  formData: SignUpFormData;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  resetFormData: () => void;
  getStepData: (step: number) => Partial<SignUpFormData>;
}

const defaultFormData: SignUpFormData = {
  fullName: "",
  email: "",
  phone: "",
  licenseNumber: "",
  role: "Dentist",
  preferredContactMethod: [],
  specialty: [],
  address: "",
  state: "",
  city: "",
  country: "",
  password: "",
  clinicName: "",
  clinicPhone: "",
  clinicAddress: "",
  clinicCountry: "",
  clinicState: "",
  clinicCity: "",
  zipcode: "",
  scannerType: "",
  preferredFileTransfer: [],
  assistantName: "",
  assistantPhone: "",
  officeManager: "",
  officeManagerPhone: "",
  whoApprovesDesigns: "",
  contactTimeWindow: "",
  standardOcclusalPreference: "",
  standardShadesUsed: "",
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // No localStorage: refresh gives a fresh form so entered data is not shown after reload
  const [formData, setFormData] = useState<SignUpFormData>(defaultFormData);

  const updateFormData = useCallback((data: Partial<SignUpFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  const getStepData = useCallback((step: number): Partial<SignUpFormData> => {
    switch (step) {
      case 1:
        return {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber,
          role: formData.role,
          preferredContactMethod: formData.preferredContactMethod,
          specialty: formData.specialty,
          address: formData.address,
          state: formData.state,
          city: formData.city,
          country: formData.country,
          password: formData.password,
        };
      case 2:
        return {
          clinicName: formData.clinicName,
          clinicPhone: formData.clinicPhone,
          clinicAddress: formData.clinicAddress,
          clinicCountry: formData.clinicCountry,
          clinicState: formData.clinicState,
          clinicCity: formData.clinicCity,
          zipcode: formData.zipcode,
          scannerType: formData.scannerType,
          preferredFileTransfer: formData.preferredFileTransfer,
        };
      case 3:
        return {
          assistantName: formData.assistantName,
          assistantPhone: formData.assistantPhone,
          officeManager: formData.officeManager,
          officeManagerPhone: formData.officeManagerPhone,
          whoApprovesDesigns: formData.whoApprovesDesigns,
          contactTimeWindow: formData.contactTimeWindow,
          standardOcclusalPreference: formData.standardOcclusalPreference,
          standardShadesUsed: formData.standardShadesUsed,
        };
      default:
        return {};
    }
  }, [formData]);

  return (
    <SignUpContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        getStepData,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};


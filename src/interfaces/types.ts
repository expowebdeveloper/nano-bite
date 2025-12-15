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
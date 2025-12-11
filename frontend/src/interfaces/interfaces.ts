import { FC, ReactNode } from "react";

export interface User {
  id: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface FormValues {
  [key: string]: string;
}
export interface ValidationRule {
  required?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?:
    | ((value: any, formValues: FormValues) => string | true)
    | ((value: any) => string | true);
}
export interface ChildrenProps {
  children: ReactNode;
}

export interface QC {
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  isActive?: boolean;
}

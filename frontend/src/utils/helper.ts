import parsePhoneNumberFromString from "libphonenumber-js";
import { PhoneNumberUtil } from "google-libphonenumber";

export const getCountryFromNumber = (phoneNumber: string) => {
    try {
      const parsedNumber = parsePhoneNumberFromString(phoneNumber);
      if (parsedNumber) {
        return parsedNumber.country;
      }
      return undefined;
    } catch (error) {
      console.error("Error parsing phone number:", error);
      return undefined;
    }
  };
  
  const phoneUtil = PhoneNumberUtil.getInstance();

  export const isPhoneValid = (phone: string, region: string = "US"): boolean => {
    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(phone, region);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Phone number validation error:", error.message);
      }
      return false;
    }
  };
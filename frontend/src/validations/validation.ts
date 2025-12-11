import { isPhoneValid } from "../utils/helper";

export const LoginValidations = {
    mobileNumber: {
      required: "mobile_required",
    },
    countryList: {
      required: "Country is required",
    },
    password: {
      required: "password_required",
    },
    validate: (value: string) => isPhoneValid(value) || "valid_mobile_number_msg",
  };

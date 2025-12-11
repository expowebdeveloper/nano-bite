import {
    Controller,
    FieldError,
    FieldValues,
    Path,
    UseFormReturn,
  } from "react-hook-form";
  import PhoneInput from "react-phone-input-2";
  import "react-phone-input-2/lib/style.css";
  import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";
  import { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
import { getCountryFromNumber } from "../../../utils/helper";
import ErrorMessage from "../ErrorMessage";
  
  interface InputFieldProps<T extends FieldValues> {
    fieldName: Path<T>;
    placeholder: string;
    label?: string;
    country?: CountryCode;
    customClassInput?: string;
    formConfig: UseFormReturn<T>;
    errorMsg?: string;
    disableCountryCode?: boolean;
    disabled?: boolean;
    disableDropdownClass?: boolean;
    isRequired?: boolean;
    shouldNotDuplicate?: boolean;
    otherPhoneNumber?: string[];
  }
  
  const PhoneNumberField = <T extends FieldValues>({
    fieldName,
    formConfig,
    label,
    placeholder,
    country,
    customClassInput = "!w-full !bg-transparent !rounded-lg !rounded-[8px] !p-2 text-black !h-[auto]",
    errorMsg,
    disableCountryCode = true,
    disableDropdownClass = false,
    disabled = false,
    isRequired = true,
    shouldNotDuplicate = false,
    otherPhoneNumber = [],
  }: InputFieldProps<T>) => {
    const {
      formState: { errors },
      control,
    } = formConfig;
    const error = errors[fieldName] as FieldError | undefined;
    // const userDetails = useSelector(
    //   (state: any) => state.userProfile.userDetails
    // );
  
    // State to track the selected country
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>();
    // useEffect(() => {
    //   // Function to get country name from phone number
    //   if (country) {
    //     setSelectedCountry(country);
    //   } else {
    //     if (userDetails.phone_number && !formConfig.getValues(fieldName)) {
    //       setSelectedCountry(getCountryFromNumber(userDetails.phone_number));
    //     }
    //   }
    // }, [country, userDetails.phone_number]);
  
    const validatePhoneNumber = (value: string) => {
      const stringValue = (value || "").trim();
  
      // Get country calling code from libphonenumber-js
      const phoneNumber = parsePhoneNumberFromString(
        stringValue,
        selectedCountry
      );
      const countryCallingCode = phoneNumber?.countryCallingCode || "";
  
      // if (!stringValue && isRequired) {
      //   return "Phone number is required";
      // }
      // Only validate phone number format if a value is provided
      if (stringValue) {
        // Strip the country code if already present
        const nationalNumber = stringValue.startsWith(`${countryCallingCode}`)
          ? stringValue.replace(`${countryCallingCode}`, "")
          : stringValue;
  
        // Validate the number format if user has entered something
        const parsedNumber = parsePhoneNumberFromString(
          nationalNumber,
          selectedCountry
        );
        if (!parsedNumber?.isValid()) {
          return "Invalid phone number";
        }
        if (shouldNotDuplicate && otherPhoneNumber.includes(stringValue)) {
          return "Phone number already exists";
        }
      } else {
        if (isRequired) {
          return "Phone number is required";
        }
        return "";
      }
  
      // if (!stringValue) {
      //   console.log(isRequired, "isRequired", stringValue);
      //   if (isRequired) {
      //     return "Phone number is required";
      //   }
      //   return "";
      // }
  
      // // Strip the country code if already present
      // const nationalNumber = stringValue.startsWith(`${countryCallingCode}`)
      //   ? stringValue.replace(`${countryCallingCode}`, "")
      //   : stringValue;
  
      // // Re-validate using the extracted national number
      // const parsedNumber = parsePhoneNumberFromString(
      //   nationalNumber,
      //   selectedCountry
      // );
      // return parsedNumber && parsedNumber.isValid()
      //   ? true
      //   : "Invalid phone number";
    };
  
    return (
      <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#6C6C6C] mb-1">{label}</label>}
      <Controller
          name={fieldName}
          control={control}
          rules={{ validate: validatePhoneNumber }}
          render={({ field: { onChange, ref, ...field } }) => (
            <PhoneInput
              {...field}
              inputProps={{
                ref,
                // required: true,
                autoFocus: true,
              }}
              country={selectedCountry?.toLowerCase()}
              placeholder={placeholder}
              disableDropdown={disableCountryCode}
              searchPlaceholder={"search_country"}
              enableSearch={true}
              countryCodeEditable={!disableCountryCode}
              onChange={(phone, countryData: any) => {
                // Only add + if there's actual input
                const shouldAddPlus = phone.length > 0;
                const formattedPhone = shouldAddPlus
                  ? phone.startsWith("+")
                    ? phone
                    : `+${phone}`
                  : phone;
                onChange(formattedPhone);
                // Type assertion for countryData
                const countryCode = (countryData as { countryCode: string })
                  .countryCode;
                setSelectedCountry(countryCode?.toUpperCase() as CountryCode);
              }}
              disabled={disabled}
              disableCountryGuess={false}
              containerClass="w-full rounded-lg"
              inputClass={customClassInput}
              buttonClass={
                disableDropdownClass
                  ? "!bg-transparent"
                  : `!bg-transparent !h-[50px] !bg-[#f2f6f8] !rounded-2xl !border !border-solid !border-[#dde4ec] ${disableCountryCode ? "!hidden" : ""}`
              }
            />
          )}
        />
        <ErrorMessage errorMsg={errorMsg || error?.message || ""} />
      </div>
    );
  };
  
  export default PhoneNumberField;
  
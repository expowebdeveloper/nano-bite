import { TOAST_MESSAGE_TYPE } from "../../Constants/Constants";
import { confirmationMessage } from "./ToastMessage";

export const useShowErrorMessage = () => {

  return (msg?: string | undefined) => {
    const errorMsg = msg || "something_went_wrong";
    return confirmationMessage(errorMsg, TOAST_MESSAGE_TYPE.error);
  };
};

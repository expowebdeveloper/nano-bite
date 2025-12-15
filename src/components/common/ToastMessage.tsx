import { toast } from "react-toastify";
import { TOAST_MESSAGE_TYPE } from "../../Constants/Constants";

export const confirmationMessage = (msg: string, type: string) => {
  if (type === TOAST_MESSAGE_TYPE.error) return toast.error(msg);
  else toast.success(msg);
};

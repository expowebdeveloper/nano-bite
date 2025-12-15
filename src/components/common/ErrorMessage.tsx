
interface props {
  errorMsg: string;
}

const ErrorMessage = ({ errorMsg }: props) => {
  return <>{errorMsg && <p className="text-red-500 text-[12px]">{errorMsg}</p>}</>;
};

export default ErrorMessage;

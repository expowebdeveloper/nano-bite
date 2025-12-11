import Loader from "../Loader/Loader";

interface props {
  isEdit?: boolean;
  isLoading?: boolean;
  zClass?: string;
}

const ScreenLoader = ({ isEdit = false, isLoading = false, zClass = "z-[60]" }: props) => {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${zClass} ${
        isEdit ? "bg-opacity-95" : "bg-opacity-75"
      } bg-white z-50`}
    >
      <Loader />
    </div>
  );
};

export default ScreenLoader;

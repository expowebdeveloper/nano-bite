import { Loader } from "lucide-react";

export default function ButtonLoader() {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader className="animate-spin text-[#3BA6E5]" size={48} />
    </div>
  );
}

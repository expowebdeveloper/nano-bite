import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function ImplantConfirmation({
    selectedTeeth = [],
}: {
  selectedTeeth?: number[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Open Modal
      </button> */}

      <ConfirmationModal
        isOpen={open}
        toothNumber={selectedTeeth.length > 0 ? selectedTeeth.join(", ") : " "}
        onClose={() => setOpen(false)}
        onCancel={() => {
          setOpen(false)
          console.log("User needs more items");
        }}
        onConfirm={() => {
          setOpen(false);
          console.log("All done");
        }}
      />
    </>
  );
}

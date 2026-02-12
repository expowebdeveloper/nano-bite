import { Co } from "react-flags-select";
import images1 from "../../../../../assets/images/main1.png";
import { CommanHeading } from "../../../CommanHeading";

type PhotoCardProps = {
  index: number;
};

function PhotoCard({ index }: PhotoCardProps) {
  return (
    <div
      className="
        aspect-[6/7]
        w-full
        rounded-xl
        border
        border-gray-200
        bg-white
      "
    >
        <img src={images1} alt="toothPhotos"/>

    </div>
  );
}

export default function OptionalPhotos() {
  return (
    <div className="space-y-4">
      {/* Heading */}
      
      <CommanHeading
        caseName="Adding an Implant Restoration"
        titleName="Optional Photos"
      />

      {/* Cards */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >
        {[1, 2, 3].map((item) => (
          <PhotoCard key={item} index={item} />
        ))}
      </div>
    </div>
  );
}

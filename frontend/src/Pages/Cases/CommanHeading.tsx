interface CommanHeadingProps {
  caseName: string;
  titleName: any;
}

export const CommanHeading: React.FC<CommanHeadingProps> = ({
  caseName,
  titleName,
}) => {
  return (
    <>
      <p className="font-normal text-[16px] leading-[20px] tracking-normal align-middle mb-[15px]">{caseName}</p>
      <h2 className="font-medium text-[26px] leading-normal tracking-normal align-middle !m-0">{titleName}</h2>
    </>
  );
};

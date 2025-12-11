interface props {
    src: string;
    alt: string;
    className?: string;
    onClick?: () => void;
  }
  const ImgIcon = ({ src, alt, className, onClick }: props) => {
    return <img src={src as string} alt={alt} className={className} onClick={onClick} />;
  };
  
  export default ImgIcon;
  
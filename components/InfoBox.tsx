import Link from "next/link";
import { ReactNode } from "react";

type ButtonInfo = {
  text: string;
  link: string;
  backgroundColor: string;
};

type InfoBoxProps = {
  title: string;
  children: ReactNode;
  buttonInfo: ButtonInfo;
  backgroundColor?: string;
  textColor?: string;
};

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  children,
  buttonInfo,
  backgroundColor = "bg-gray-100",
  textColor = "text-gray-800",
}) => {
  return (
    <div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
      <h2 className={`${textColor} text-2xl text-bold`}>{title}</h2>
      <p className="mt-2 mb-4">{children}</p>
      <Link
        href={buttonInfo.link}
        className={`${buttonInfo.backgroundColor} inline-block text-white rounded-lg px-4 py-2 hover:bg-gray-700`}>
        {buttonInfo.text}
      </Link>
    </div>
  );
};

export default InfoBox;

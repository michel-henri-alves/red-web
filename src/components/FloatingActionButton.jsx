import { useTranslation } from "react-i18next";

export default function FloatingActionButton({ onClick, content, position, tooltip }) {
  
  const { t } = useTranslation();

  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={`fixed ${position} right-6 bg-[rgba(228,88,88)] hover:bg-[rgba(255,50,50)] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer`}
    >
      {content}
    </button>
  );
}
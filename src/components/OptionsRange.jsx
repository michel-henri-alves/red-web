import { useTranslation } from 'react-i18next';

export default function OptionsRange({ text, options, selected, setSelected }) {
    const { t } = useTranslation();

    return (
        <div>
            <h3 id="payment-options" className="text-base font-semibold text-gray-800 text-center">
                {text}
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
                {options.map((option, idx) => {
                    const isSelected = selected === option.value;
                    return (
                        <button
                            key={option.value}
                            ref={option.ref}
                            type="button"
                            onClick={() => setSelected(option.value)}
                            aria-pressed={isSelected}
                            aria-label={option.label}
                            className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-transform cursor-pointer
                  ${option.colorClass} ${isSelected ? "ring-2 ring-offset-2 ring-blue-500 scale-120" : "hover:scale-120"}
                `}
                        >
                            <option.icon />
                            <span className="truncate">{option.label}</span>
                            <span className="sr-only">{isSelected ? t("selected") : ""}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

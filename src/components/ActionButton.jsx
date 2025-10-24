export default function ActionButton({ text, icon: Icon, bgColor = "blue", type = "button", onClick, additionalStyle, disabled, ref }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            ref={ref}
            className={
                `flex items-center gap-2 px-6 py-3 bg-${bgColor} text-white font-semibold rounded-lg shadow-md
                hover:bg-${bgColor}-700 hover:shadow-lg hover:shadow-${bgColor}-500/50
                transition-all duration-300 active:scale-95 cursor-pointer
                w-full sm:w-auto transition-transform duration-200 hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed ${additionalStyle}
      `}
        >
            <Icon size={40}/>
            <span>{text}</span>
        </button>
    );
}

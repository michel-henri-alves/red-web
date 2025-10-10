export default function ActionButton({ onClick, bgColor, text, icon }) {
    return (
        <button
            className={`px-6 py-3 bg-${bgColor}-600 text-white font-semibold rounded-lg shadow-md
                            hover:bg-${bgColor}-700 hover:shadow-lg hover:shadow-${bgColor}-500/50
                            transition-all duration-300 active:scale-95 cursor-pointer`}
            onClick={onClick}
        >
            {icon}{text}
        </button>
    );
}
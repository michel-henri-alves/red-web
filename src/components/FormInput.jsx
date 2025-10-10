export default function FormInput({
    label,
    name,
    value,
    placeholder,
    onChange,
    errors,
    icon,
    inputRef,
    type
}) {

    return (
        <div className="w-full max-w-sm">
            <label htmlFor={name} class="block text-2xl font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-gray-400">
                    {icon}
                </span>
                <input
                    type={type}
                    ref={inputRef}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-[rgba(209,209,233)]
                               text-gray-900 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               shadow-sm transition duration-200"
                />
                {errors && <p className="text-red-500 text-sm">{errors}</p>}
            </div>
        </div>
    );
}
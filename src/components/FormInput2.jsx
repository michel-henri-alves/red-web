export default function FormInput({ label, name, value, placeholder, onChange, onBlur, errors, icon, inputRef, type = "text" }) {
  return (
    <div className="w-full relative">
      <label className="flex items-center space-x-2 text-lg font-medium text-gray-700 mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </label>

      <input
        ref={inputRef}
        type={type}
        name={name}
        value={type === "number" ? value : value || ""}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full py-3 px-4 text-lg rounded-xl border-2
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
          transition-all duration-200
          ${errors ? "border-red-500 animate-shake shadow-md" : "border-gray-300"}
        `}
        aria-invalid={!!errors}
        aria-describedby={`${name}-error`}
      />

      {errors && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1 absolute left-0 animate-fade-in">
          {errors}
        </p>
      )}
    </div>
  );
}

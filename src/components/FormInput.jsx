import ProgressBar from "./ProgressBar";
import InfoTooltip from "./InfoTooltip";

export default function FormInput({ label, name, value, placeholder, onChange, onBlur, errors, icon: Icon, inputRef, type = "text", max, maxLength }) {
  return (
    <div className="w-full relative">
      <label className="flex items-center space-x-2 text-lg font-medium text-gray-700 mb-1">
        <Icon size={30}/>
        <span>{label}</span>
        <InfoTooltip text={`Informe o ${label} corretamente`} />
      </label>

      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          bg-white w-full py-3 px-4 text-lg rounded-xl border-2
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
          focus:shadow-lg focus:shadow-blue-500/50
          shadow-md hover:shadow-lg transition-shadow
          transition-all duration-200
          ${errors ? "border-red-500 animate-shake shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/50"
            : "border-gray-300"}`}
        aria-invalid={!!errors}
        aria-describedby={`${name}-error`}
        min="0"
      />

      {type === "number" && max && <ProgressBar value={value || 0} max={max} />}

      {errors && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1 absolute left-0 animate-fade-in">
          {errors}
        </p>
      )}
    </div>
  );
}

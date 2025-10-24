import ProgressBar from "./ProgressBar";
import InfoTooltip from "./InfoTooltip";

export default function MoneyInput({ name, value, onChange, label, icon: Icon, textSize, type, max, errors, inputRef, ...props }) {
  
  const formatMoney = (e) => {
    const numeric = e.replace(/\D/g, "");
    return (Number(numeric) / 100).toFixed(2);
  };

  const handleChange = (e) => {
    const formatted = formatMoney(e.target.value);
    e.target.value = formatted;
    onChange?.(e);
  };
  
  return (
    <div className="w-full relative">
      <label className="flex items-center space-x-2 text-lg font-medium text-gray-700 mb-1">
        <Icon size={30}/>
        <span>{label}</span>
        <InfoTooltip text={`Informe o ${label} corretamente`} />
      </label>

      <input
        {...props}
        type={type}
        value={type === "number" ? value : value || ""}
        name={name}
        placeholder="0,00"
        onChange={handleChange}
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
        ref={inputRef}
      />

      {type === "number" && max && <ProgressBar value={value || 0} max={max} />}
        {errors && (
          <p id={`${name}-error`} className="text-red-500 text-sm mt-1 absolute left-0 animate-fade-in">
            {errors}
          </p>
          )
        }

    </div>
  );
}
export default function FormInput({ inputData, label }) {
    return (
        inputData !== 0 && inputData && <p className="p-2 px-4 rounded-xl bg-[rgba(228,88,88)] text-white transition flex items-center gap-1">
            <strong>{label}:</strong> {inputData}
        </p> 
    );
}

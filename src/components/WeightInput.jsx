import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "./FormInput";

export default function WeightInput({ setWeightParam, label }) {
  const { t } = useTranslation();
  const [weight, setWeight] = useState(0);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");


  const inputRef = useRef(null);

  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");

    if (!val) {
      setWeight(0);
      return;
    }

    const num = parseFloat(val) / 1000;
    setWeight(num);
    setWeightParam(num);
  };

  // Sempre que o value muda, coloca o cursor no final
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }

    (parseFloat(input.value) >= 1) ? setUnitOfMeasurement(t("weight.k")) : setUnitOfMeasurement(t("weight.base"));

  }, [weight]);


  return (
    <div>

      <FormInput
        inputRef={inputRef}
        label={label}
        value={weight.toFixed(3)}
        placeholder="0.000"
        onChange={handleChange}
        icon="🏋"
        type="text" />

      <span>{unitOfMeasurement}</span>
    </div>
  );
}

import { useReducer, useState } from "react";

export const getInitialState = (initialData) => ({ ...initialData });

function formReducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "RESET":
            return getInitialState(action.payload);
        default:
            return state;
    }
}

export function useForm({ initialData = {}, fieldsConfig = [], onSubmit }) {
    const [form, dispatch] = useReducer(formReducer, getInitialState(initialData));
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const validationErrors = {};
        fieldsConfig.forEach(({ name, label, required }) => {
            if (required && !form[name]) validationErrors[name] = `${label} é obrigatório`;
        });
        return validationErrors;
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        let val = type === "checkbox" ? checked : value;
        dispatch({ type: "SET_FIELD", field: name, value: val });
        if (touched[name]) setErrors(validate());
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors(validate());
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        const validationErrors = validate();

        // 🔴 Se houver erros, mostrar todos e marcar campos como tocados
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            // ✅ Marca todos os campos como tocados para exibir mensagens
            const touchedFields = {};
            fieldsConfig.forEach((field) => {
                touchedFields[field.name] = true;
            });
            setTouched(touchedFields);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(form);
            setErrors({});
            setTouched({});
        } finally {
            setIsSubmitting(false);
        }
    };


    const resetForm = (data = {}) => dispatch({ type: "RESET", payload: data });

    return { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm, dispatch };
}

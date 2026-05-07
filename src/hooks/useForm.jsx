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

    const isEmpty = (value) => value === "" || value === null || value === undefined;

    const sanitizeForm = () => {
        return fieldsConfig.reduce((data, field) => {
            const value = data[field.name];

            if (field.type === "number") {
                if (isEmpty(value)) {
                    delete data[field.name];
                } else {
                    data[field.name] = Number(value);
                }
            }

            return data;
        }, { ...form });
    };

    const validate = (values = form) => {
        const validationErrors = {};
        fieldsConfig.forEach(({ name, label, required, type, maxLength, minLength }) => {
            if (required && isEmpty(values[name])) {
                validationErrors[name] = `${label} é obrigatório`;
                return;
            }

            if (minLength && !isEmpty(values[name]) && String(values[name]).length < minLength) {
                validationErrors[name] = `${label} deve ter pelo menos ${minLength} caracteres`;
            }

            if (maxLength && !isEmpty(values[name]) && String(values[name]).length > maxLength) {
                validationErrors[name] = `${label} deve ter no máximo ${maxLength} caracteres`;
            }

            if (type === "number" && !isEmpty(values[name]) && Number.isNaN(Number(values[name]))) {
                validationErrors[name] = `${label} deve ser um número`;
            }

            if (type === "email" && !isEmpty(values[name]) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[name])) {
                validationErrors[name] = `${label} deve ser um email válido`;
            }
        });
        return validationErrors;
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const fieldConfig = fieldsConfig.find((field) => field.name === name);
        let val = type === "checkbox" ? checked : value;

        if (fieldConfig?.maxLength && typeof val === "string") {
            val = val.slice(0, fieldConfig.maxLength);
        }

        dispatch({ type: "SET_FIELD", field: name, value: val });
        if (touched[name]) setErrors(validate({ ...form, [name]: val }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors(validate());
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            const touchedFields = {};
            fieldsConfig.forEach((field) => {
                touchedFields[field.name] = true;
            });
            setTouched(touchedFields);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(sanitizeForm());
            setErrors({});
            setTouched({});
        } finally {
            setIsSubmitting(false);
        }
    };


    const resetForm = (data = {}) => dispatch({ type: "RESET", payload: data });

    return { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm, dispatch };
}

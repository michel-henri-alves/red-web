export const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  const number = Number(value.toString().replace(/\D/g, "")) / 100;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};
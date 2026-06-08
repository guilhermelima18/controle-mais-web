export const cpfMask = (value: string) => {
  if (!value) return "";

  value = value?.replace(/\D/g, "");
  value = value?.replace(/(\d{3})(\d)/, "$1.$2");
  value = value?.replace(/(\d{3})(\d)/, "$1.$2");
  value = value?.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return value;
};

export const formatCurrency = (value: string) => {
  const numeric = Number(value.replace(/\D/g, ""));
  const number = isNaN(numeric) ? 0 : numeric / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

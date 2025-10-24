export function useWhatsAppMessage() {

  const openWhatsApp = (customerPhone: string, message: string) => {
    const phone = customerPhone;
    const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return { openWhatsApp };
}
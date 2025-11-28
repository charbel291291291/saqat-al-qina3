export interface WhatsAppMessageData {
  caseId: string;
  caseTitle: string;
  category: string;
  location: string;
  shortDescription: string;
}

export const generateWhatsAppLink = (
  phoneNumber: string,
  data: WhatsAppMessageData
): string => {
  // Remove any non-digit characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Build the message
  const message = `🚨 قضية جديدة - سقط القناع

📋 العنوان: ${data.caseTitle}
📂 الفئة: ${data.category}
📍 الموقع: ${data.location}
📝 الوصف: ${data.shortDescription}

🔗 رابط القضية: ${window.location.origin}/case/${data.caseId}

يرجى مراجعة القضية والبدء بالتحقيق.`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Return WhatsApp deep link
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const openWhatsApp = (link: string): void => {
  window.open(link, '_blank');
};

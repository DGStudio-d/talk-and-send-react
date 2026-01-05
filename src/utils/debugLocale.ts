/**
 * Debug utility to check current locale settings
 */
export const debugLocale = () => {
  const selectedLanguage = localStorage.getItem("selectedLanguage");
  const locale = localStorage.getItem("locale");
  const currentLanguage = navigator.language || "en-US";

  console.log("🌐 Locale Debug Information:");
  console.log("📱 Browser language:", currentLanguage);
  console.log("🗂️ Selected language:", selectedLanguage);
  console.log("🌐 API locale:", locale);
  console.log("📦 localStorage:", {
    selectedLanguage,
    locale,
  });

  // Test API call with current locale
  fetch("/api/languages?locale=" + locale, {
    headers: {
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📥 API Response:", data);
      if (data.data && data.data.length > 0) {
        console.log("🗣️ First language name:", data.data[0].name);
      }
    })
    .catch((error) => {
      console.error("❌ API Error:", error);
    });
};

/**
 * Force refresh locale in localStorage
 */
export const refreshLocale = (language: string) => {
  localStorage.setItem("selectedLanguage", language);
  localStorage.setItem("locale", language);
  console.log(`🔄 Locale refreshed to: ${language}`);
  window.location.reload();
};

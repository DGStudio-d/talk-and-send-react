
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import WhatsAppForm from "@/components/whatsapp/WhatsAppForm";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";

const WhatsAppPage = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-12" dir={dir}>
        <h1 className="text-3xl font-bold text-center mb-6 rtl">
          {t('whatsapp.title')}
        </h1>
        <p className="text-center text-gray-600 mb-12 rtl max-w-2xl mx-auto">
          {t('whatsapp.description')}
        </p>
        
        <div className="flex justify-center">
          <WhatsAppForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WhatsAppPage;

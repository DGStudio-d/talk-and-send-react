import { useLanguage } from "@/contexts/LanguageContext";
import WhatsAppForm from "@/components/whatsapp/WhatsAppForm";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";

const WhatsAppPage = () => {
  useLocaleQuery();
  const { t, dir } = useLanguage();

  return (
    <div>
      <Header variant="solid" />
      <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
        <h1 className="text-3xl font-bold text-center mb-6 rtl">
          {t("whatsapp.title")}
        </h1>
        <p className="text-center text-gray-600 mb-12 rtl max-w-2xl mx-auto">
          {t("whatsapp.description")}
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

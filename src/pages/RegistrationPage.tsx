
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import RegistrationForm from "@/components/registration/RegistrationForm";
import BankTransferInfo from "@/components/registration/BankTransferInfo";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegistrationPage = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-12" dir={dir}>
        <h1 className="text-3xl font-bold text-center mb-6 rtl">
          {t('register.title')}
        </h1>
        <p className="text-center text-gray-600 mb-12 rtl max-w-2xl mx-auto">
          {t('register.description')}
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">{t('register.paymentMethod.card')}</TabsTrigger>
              <TabsTrigger value="bank">{t('register.paymentMethod.bank')}</TabsTrigger>
            </TabsList>
            <TabsContent value="card">
              <RegistrationForm />
            </TabsContent>
            <TabsContent value="bank">
              <BankTransferInfo />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationPage;

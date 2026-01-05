import { useLanguage } from "@/contexts/LanguageContext";
import RegistrationForm from "@/components/registration/RegistrationForm";
import BankTransferInfo from "@/components/registration/BankTransferInfo";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguages } from "@/services";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";

const RegistrationPage = () => {
  useLocaleQuery();
  const { t, dir } = useLanguage();

  // Preload languages for registration form
  const { data: languages = [], isLoading: languagesLoading } = useLanguages({
    is_active: true,
    active_only: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="solid" />
      <div className="container mx-auto px-4 py-8 pt-24" dir={dir}>
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="App Logo"
            className="h-20 w-20 mx-auto mb-4"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <h1 className="text-3xl font-bold text-gray-900">
            {t("register.title")}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="registration" className="w-full">
            {/* Tab Navigation */}
            <div className="mx-4 mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-full p-1">
                <TabsTrigger
                  value="registration"
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t("register.tabs.registration")}
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t("register.tabs.payment")}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="registration" className="mt-0">
              <RegistrationForm
                languages={languages}
                languagesLoading={languagesLoading}
              />
            </TabsContent>
            <TabsContent value="payment" className="mt-0">
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

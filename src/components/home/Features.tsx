
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, CreditCard, Users } from "lucide-react";

const Features = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-academy-green" />,
      title: t('features.quality'),
      description: t('features.quality.desc')
    },
    {
      icon: <CreditCard className="h-10 w-10 text-academy-green" />,
      title: t('features.prices'),
      description: t('features.prices.desc')
    },
    {
      icon: <Clock className="h-10 w-10 text-academy-green" />,
      title: t('features.schedule'),
      description: t('features.schedule.desc')
    },
    {
      icon: <Users className="h-10 w-10 text-academy-green" />,
      title: t('features.groups'),
      description: t('features.groups.desc')
    }
  ];

  return (
    <div className="py-16 bg-white" dir={dir}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 rtl">
          {t('features.whyChooseUs')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-3 rtl">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center rtl">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

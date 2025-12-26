
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const BankTransferInfo = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <Card className="w-full" dir={dir}>
      <CardHeader>
        <CardTitle className={`text-2xl font-bold text-center ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
          {t('register.bankTransfer.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-6 ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
        <p className="text-center">
          {t('register.bankTransfer.instruction')}
        </p>

        {/* BARID BANK Information */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            {t('register.bankTransfer.baridBank')}
          </h3>
          <div className="space-y-2 bg-gray-50 p-4 rounded-md">
            <p><span className="font-semibold">RIB:</span> 350810000000007352205 97</p>
            <p><span className="font-semibold">IBAN:</span> MA64 350 810 <span className="text-academy-green font-semibold">000000000735220</span> 597</p>
          </div>
        </div>

        {/* CIH BANK Information */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            {t('register.bankTransfer.cihBank')}
          </h3>
          <div className="space-y-2 bg-gray-50 p-4 rounded-md">
            <p><span className="font-semibold">{t('register.bankTransfer.accountHolder')}:</span> Learn Accademy</p>
            <p><span className="font-semibold">RIB:</span> 230 610 <span className="text-academy-green font-semibold">3678445211001600</span> 13</p>
            <p><span className="font-semibold">IBAN:</span> MA64 <span className="text-academy-green font-semibold">2306 1036 7844 5211 0016 0013</span></p>
            <p><span className="font-semibold">Code SWIFT:</span> CIHMMAMC</p>
          </div>
        </div>

        {/* Contact after transfer */}
        <div className="border-t pt-6 text-center">
          <p className="mb-4">
            {t('register.bankTransfer.contactAfter')}
          </p>
          <Button
            asChild
            className="bg-green-500 hover:bg-green-600 py-6 px-8 text-lg flex items-center gap-2"
          >
            <Link to="/whatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              {t('register.bankTransfer.contactWhatsApp')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferInfo;

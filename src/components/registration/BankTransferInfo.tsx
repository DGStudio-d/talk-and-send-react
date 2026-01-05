
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MessageSquare, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const BankTransferInfo = () => {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const copyToClipboard = (text: string, label: string) => {
    const cleanText = text.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanText);
    toast({
      title: t('register.payment.copied'),
      description: `${label} ${t('register.payment.copiedToClipboard')}`,
    });
  };

  const openWhatsApp = () => {
    const phoneNumber = "+212625815692";
    const message = encodeURIComponent(
      `Hello! I have completed the bank transfer for my subscription. Please confirm my payment.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="px-4 space-y-6" dir={dir}>
      {/* Payment Info Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            {t('register.payment.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Attijariwafa Bank */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('register.payment.attijariwafa')}</h3>
            
            <PaymentDetailRow
              label={t('register.payment.accountNumber')}
              value="007 640 000 123 456 789 012"
              copyable
              onCopy={() => copyToClipboard("007640000123456789012", t('register.payment.accountNumber'))}
            />
            
            <PaymentDetailRow
              label={t('register.payment.accountHolder')}
              value="Language Learning Center"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-4">{t('register.payment.baridBank')}</h3>
            
            <PaymentDetailRow
              label="RIB"
              value="350810000000007352205 97"
              copyable
              onCopy={() => copyToClipboard("35081000000000735220597", "RIB")}
            />
            
            <PaymentDetailRow
              label="IBAN"
              value="MA64 350 810 000000000735220 597"
              copyable
              onCopy={() => copyToClipboard("MA64350810000000000735220597", "IBAN")}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-4">{t('register.payment.cihBank')}</h3>
            
            <PaymentDetailRow
              label={t('register.payment.accountHolder')}
              value="ZAKARIA AFIF"
            />
            
            <PaymentDetailRow
              label="RIB"
              value="230 610 367844521100160 013"
              copyable
              onCopy={() => copyToClipboard("230610367844521100160013", "RIB")}
            />
            
            <PaymentDetailRow
              label="IBAN"
              value="MA64 2306 1036 7844 5211 0016 0013"
              copyable
              onCopy={() => copyToClipboard("MA64230610367844521100160013", "IBAN")}
            />
            
            <PaymentDetailRow
              label={t('register.payment.swiftCode')}
              value="CIHMMAMX"
              copyable
              onCopy={() => copyToClipboard("CIHMMAMX", t('register.payment.swiftCode'))}
            />
          </div>

          {/* WhatsApp Confirmation */}
          <div className="border-t pt-6">
            <PaymentDetailRow
              label={t('register.payment.whatsappConfirmation')}
              value="+212 625-815692"
              isWhatsApp
              onWhatsApp={openWhatsApp}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Plan Summary (if available) */}
      {selectedPlan && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">{t('register.payment.selectedPlan')}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {t(`subscription.${selectedPlan.type}`)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPlan.sessions_per_month} {t('register.form.sessionsPerMonth')} × {Math.floor(selectedPlan.session_duration_minutes / 60)}h
                </p>
              </div>
              <span className="text-lg font-bold text-primary">
                ${selectedPlan.price}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-amber-800 mb-2">
            {t('register.payment.instructions')}
          </h3>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
            <li>{t('register.payment.step1')}</li>
            <li>{t('register.payment.step2')}</li>
            <li>{t('register.payment.step3')}</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

interface PaymentDetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  isWhatsApp?: boolean;
  onCopy?: () => void;
  onWhatsApp?: () => void;
}

const PaymentDetailRow = ({ 
  label, 
  value, 
  copyable = false, 
  isWhatsApp = false, 
  onCopy, 
  onWhatsApp 
}: PaymentDetailRowProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {isWhatsApp ? (
            <button
              onClick={onWhatsApp}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <span>{value}</span>
              <MessageSquare className="h-5 w-5" />
            </button>
          ) : (
            <span className="font-semibold text-gray-900">{value}</span>
          )}
        </div>
        {copyable && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="ml-2 h-8 px-3"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        )}
      </div>
    </div>
  );
};

export default BankTransferInfo;

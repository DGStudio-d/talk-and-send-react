
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendWhatsAppMessage } from "@/services/whatsappService";

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل" }),
  message: z.string().min(10, { message: "الرسالة مطلوبة ويجب أن تكون 10 أحرف على الأقل" }),
});

type FormValues = z.infer<typeof formSchema>;

const WhatsAppForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { dir } = useLanguage();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  // This would typically come from an environment variable or configuration
  const whatsappNumber = "212625815692"; // Learn Academy WhatsApp number

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const message = `مرحباً، اسمي ${data.name}. ${data.message}`;
      sendWhatsAppMessage(whatsappNumber, message);
      
      toast({
        title: "تم إرسال الرسالة",
        description: "ستفتح نافذة الواتساب الآن",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir={dir}>
      <CardHeader>
        <CardTitle className="rtl text-2xl font-bold text-center">
          {t('whatsapp.form.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rtl">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              {t('whatsapp.form.name')}
            </label>
            <Input
              id="name"
              placeholder={t('whatsapp.form.name')}
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              {t('whatsapp.form.message')}
            </label>
            <Textarea
              id="message"
              placeholder={t('whatsapp.form.message')}
              {...register("message")}
              className="w-full h-32"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-academy-green hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('whatsapp.form.sending') : t('whatsapp.form.send')}
          </Button>

          <p className="text-center text-sm text-gray-500">
            {t('whatsapp.form.hint')}
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppForm;

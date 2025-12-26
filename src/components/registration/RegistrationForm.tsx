
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { languages } from "@/data/languages";
import { sendWhatsAppMessage } from "@/services/whatsappService";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  fullName: z.string().min(3),
  age: z.string().refine((val) => !isNaN(Number(val))),
  email: z.string().email(),
  phone: z.string().min(8),
  level: z.string().min(1),
  language: z.string().min(1),
  classType: z.string().min(1),
  // Card details are handled in a separate tab now
});

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: "",
      email: "",
      phone: "",
      level: "",
      language: "",
      classType: "",
    },
  });

  // This would typically come from an environment variable or configuration
  const whatsappAdminNumber = "212625815692"; // Learn Academy WhatsApp number

  const onSubmit = (data) => {
    setIsSubmitting(true);

    try {
      // Format the message for WhatsApp
      const message = `
${t('whatsapp.newRegistration')}:
${t('form.fullName')}: ${data.fullName}
${t('form.age')}: ${data.age}
${t('form.email')}: ${data.email}
${t('form.phone')}: ${data.phone}
${t('form.level')}: ${data.level}
${t('form.language')}: ${data.language}
${t('form.classType')}: ${data.classType}
${t('form.paymentMethod')}: ${t('form.creditCard')}
      `;

      // Send the message via WhatsApp
      sendWhatsAppMessage(whatsappAdminNumber, message);

      toast({
        title: t('notifications.registrationSuccess'),
        description: t('notifications.contactSoon'),
      });

      // Redirect to thank you page or home page
      navigate("/");
    } catch (error) {
      toast({
        title: t('notifications.error'),
        description: t('notifications.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="rtl text-2xl font-bold text-center">
          {t('register.form.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rtl">
            {/* Personal Information Section */}
            <h3 className="text-xl font-semibold mb-4">{t('register.form.personalInfo')}</h3>
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.fullName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.fullNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.age')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('form.agePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('form.emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.phonePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Information Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">{t('register.form.courseInfo')}</h3>
            </div>

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.selectLevel')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.chooseLevelPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">{t('level.beginner')}</SelectItem>
                      <SelectItem value="intermediate">{t('level.intermediate')}</SelectItem>
                      <SelectItem value="advanced">{t('level.advanced')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.selectLanguage')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.chooseLanguagePlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.name} {language.flag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.selectSubscription')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.chooseSubscriptionPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">{t('subscription.individual')}</SelectItem>
                      <SelectItem value="group">{t('subscription.group')}</SelectItem>
                      <SelectItem value="online">{t('subscription.online')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-academy-green hover:bg-opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('button.registering') : t('button.submitRegistration')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;

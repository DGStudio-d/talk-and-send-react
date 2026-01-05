import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, User, Mail, Phone, Lock, Check } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useRegister, useSubscriptionPlansByLanguage } from "@/services";
import type { Language } from "@/types/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedLanguageName } from "@/utils/localization";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number must be at least 8 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirmation: z.string(),
    preferred_language_id: z.string().min(1, "Please select a language"),
    level: z.string().min(1, "Please select your level"),
    subscription_plan_id: z
      .string()
      .min(1, "Please select a subscription plan"),
    accept_terms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof formSchema>;

export interface RegistrationFormProps {
  languages: Language[];
  languagesLoading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  languages,
  languagesLoading,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language: currentLanguage } = useLanguage();

  const registerMutation = useRegister();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      preferred_language_id: "",
      level: "",
      subscription_plan_id: "",
      accept_terms: false,
    },
  });

  const selectedLanguageId = form.watch("preferred_language_id");

  const selectedLanguageIdNumber = selectedLanguageId
    ? Number(selectedLanguageId)
    : 0;

  const { data: subscriptionPlans = [], isLoading: plansLoading } =
    useSubscriptionPlansByLanguage(
      Number.isFinite(selectedLanguageIdNumber) ? selectedLanguageIdNumber : 0
    );

  useEffect(() => {
    if (!selectedLanguageId) {
      form.setValue("subscription_plan_id", "");
    }
  }, [selectedLanguageId, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerErrors({});

    try {
      const registrationData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        preferred_language_id: parseInt(data.preferred_language_id),
        level: data.level,
        subscription_plan_id: parseInt(data.subscription_plan_id),
      };

      await registerMutation.mutateAsync(registrationData as any);

      toast({
        title: t("register.success.title"),
        description: t("register.success.message"),
      });

      // Show success dialog or navigate
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors || {};
        setServerErrors(errors);
        toast({
          title: t("notifications.error"),
          description: t("register.errors.validation"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("notifications.error"),
          description:
            error.response?.data?.message || t("register.errors.general"),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const levels = [
    { value: "A1", label: t("level.A1") },
    { value: "A2", label: t("level.A2") },
    { value: "B1", label: t("level.B1") },
    { value: "B2", label: t("level.B2") },
    { value: "C1", label: t("level.C1") },
    { value: "C2", label: t("level.C2") },
  ];

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Information */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.name")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      placeholder={t("register.form.namePlaceholder")}
                      className="pl-10 bg-white border-0 rounded-xl shadow-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
                {serverErrors.name && (
                  <p className="text-sm text-red-600">{serverErrors.name}</p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.email")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("register.form.emailPlaceholder")}
                      className="pl-10 bg-white border-0 rounded-xl shadow-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
                {serverErrors.email && (
                  <p className="text-sm text-red-600">{serverErrors.email}</p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.phone")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      placeholder={t("register.form.phonePlaceholder")}
                      className="pl-10 bg-white border-0 rounded-xl shadow-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
                {serverErrors.phone && (
                  <p className="text-sm text-red-600">{serverErrors.phone}</p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("register.form.passwordPlaceholder")}
                      className="pl-10 pr-10 bg-white border-0 rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                {serverErrors.password && (
                  <p className="text-sm text-red-600">
                    {serverErrors.password}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.confirmPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t(
                        "register.form.confirmPasswordPlaceholder"
                      )}
                      className="pl-10 pr-10 bg-white border-0 rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                {serverErrors.password_confirmation && (
                  <p className="text-sm text-red-600">
                    {serverErrors.password_confirmation}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Language Selection */}
          <FormField
            control={form.control}
            name="preferred_language_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.language")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white border-0 rounded-xl shadow-sm">
                      <SelectValue
                        placeholder={t("register.form.languagePlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languagesLoading ? (
                      <SelectItem value="loading" disabled>
                        {t("common.loading")}
                      </SelectItem>
                    ) : (
                      (languages || []).map((language) => (
                        <SelectItem
                          key={language.id}
                          value={language.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            {language.flag_url && (
                              <img
                                src={language.flag_url}
                                alt={getLocalizedLanguageName(
                                  language,
                                  currentLanguage
                                )}
                                className="w-6 h-4 object-cover rounded"
                              />
                            )}
                            {getLocalizedLanguageName(
                              language,
                              currentLanguage
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level Selection */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.form.level")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white border-0 rounded-xl shadow-sm">
                      <SelectValue
                        placeholder={t("register.form.levelPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subscription Plans */}
          {selectedLanguageId && (
            <div className="space-y-3">
              <FormLabel>{t("register.form.subscriptionPlan")}</FormLabel>
              {plansLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("common.loading")}
                  </p>
                </div>
              ) : subscriptionPlans.length === 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <p className="text-orange-800 text-sm">
                      {t("register.form.noPlans")}
                    </p>
                  </div>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="subscription_plan_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-3">
                          {subscriptionPlans.map((plan) => (
                            <Card
                              key={plan.id}
                              className={`cursor-pointer transition-all ${
                                field.value === plan.id.toString()
                                  ? "ring-2 ring-primary bg-primary/5"
                                  : "hover:shadow-md"
                              }`}
                              onClick={() => field.onChange(plan.id.toString())}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${
                                        plan.type === "individual"
                                          ? "bg-blue-100"
                                          : "bg-green-100"
                                      }`}
                                    >
                                      {plan.type === "individual" ? (
                                        <User
                                          className={`h-5 w-5 ${
                                            plan.type === "individual"
                                              ? "text-blue-600"
                                              : "text-green-600"
                                          }`}
                                        />
                                      ) : (
                                        <div className="flex">
                                          <User className="h-5 w-5 text-green-600" />
                                          <User className="h-5 w-5 text-green-600 -ml-2" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">
                                        {plan.type === "individual"
                                          ? t("subscription.individual")
                                          : t("subscription.group")}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        {plan.duration_months}{" "}
                                        {t("register.form.months")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-primary">
                                      ${plan.price}
                                    </span>
                                    {field.value === plan.id.toString() && (
                                      <Check className="h-5 w-5 text-primary" />
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="accept_terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    {t("register.form.acceptTerms")}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t("register.form.registering")}
              </div>
            ) : (
              t("register.form.register")
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {t("register.form.haveAccount")}{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary font-semibold hover:underline"
              >
                {t("register.form.signIn")}
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;

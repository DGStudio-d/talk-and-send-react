import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useLanguages } from '../../hooks/useLanguages';
import { subscriptionApi } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, Users, User as UserIcon, Check, CreditCard, AlertCircle } from 'lucide-react';
import { UserLevel, type SubscriptionPlan } from '../../types/models';
import Logo from '../../components/common/Logo';

// Zod validation schema with email format, password strength, and phone format
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirmation: z.string(),
    preferred_language_id: z
      .string()
      .min(1, "Please select a preferred language"),
    level: z.enum(
      [UserLevel.Beginner, UserLevel.Intermediate, UserLevel.Advanced],
      {
        message: "Please select a level",
      }
    ),
    subscription_plan_id: z
      .string()
      .min(1, "Please select a subscription plan"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { data: languages, isLoading: languagesLoading } = useLanguages({ is_active: true });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Fetch subscription plans based on selected language
  const { data: subscriptionPlans } = useQuery({
    queryKey: ["subscriptionPlans", selectedLanguageId],
    queryFn: async () => {
      if (!selectedLanguageId) return [];
      const response = await subscriptionApi.getPlansByLanguage(
        parseInt(selectedLanguageId)
      );
      return response.data.data as SubscriptionPlan[];
    },
    enabled: !!selectedLanguageId,
  });

  const selectedPlan = subscriptionPlans?.find(
    (p) => p.id === parseInt(selectedPlanId)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Convert preferred_language_id to number
      const registrationData = {
        ...data,
        preferred_language_id: parseInt(data.preferred_language_id),
      };

      await registerUser(registrationData);

      // Show success message with activation notice
      toast.success(
        t("auth.registrationPending") ||
          "Registration successful! Your account will be activated after payment confirmation. Please transfer the fee and confirm via WhatsApp.",
        { duration: 8000 }
      );

      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      // Show error toast on failure
      const errorMessage =
        error.response?.data?.message ||
        t("auth.registerError") ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('auth.createAccount') || 'Create your account'}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.haveAccount') || 'Already have an account?'}{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t('auth.signIn') || 'Sign in here'}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">
                {t('auth.registrationForm') || 'Registration Form'}
              </TabsTrigger>
              <TabsTrigger value="payment">
                {t('auth.paymentInfo') || 'Payment Info'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {t('auth.bankTransferDetails') || 'Bank Transfer Details'}
                      </CardTitle>
                      <CardDescription>
                        {t('auth.useTheseDetails') || 'Use these details to make your payment'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3 bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('auth.bankName') || 'Bank Name'}:
                      </span>
                      <span className="text-sm font-semibold">
                        Attijariwafa Bank
                      </span>
                    </div>

                    <div className="flex justify-between items-start py-2 border-b">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('auth.accountNumber') || 'Account Number'}:
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-mono font-semibold">
                          007 640 000 123 456 789 012
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText("007640000123456789012");
                            toast.success(t('auth.copiedToClipboard') || 'Copied to clipboard!');
                          }}
                          className="ml-2 h-6 text-xs"
                        >
                          {t('auth.copy') || 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('auth.accountHolder') || 'Account Holder'}:
                      </span>
                      <span className="text-sm font-semibold">
                        Language Learning Center
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('auth.whatsapp') || 'WhatsApp'}:
                      </span>
                      <a
                        href="https://wa.me/212625815692"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        +212 625-815692
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <h4 className="font-medium mb-2">
                        {t('auth.importantSteps') || 'Important Steps'}
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>{t('auth.step1') || 'Complete the registration form'}</li>
                        <li>{t('auth.step2') || 'Transfer the subscription fee to the bank account'}</li>
                        <li>{t('auth.step3') || 'Send payment confirmation via WhatsApp with your name and email'}</li>
                        <li>{t('auth.step4') || 'Wait for admin to activate your account (usually within 24 hours)'}</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name') || 'Full Name'}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.namePlaceholder')}
                    {...register('name')}
                    disabled={isLoading}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email') || 'Email address'}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    {...register('email')}
                    disabled={isLoading}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phone') || 'Phone Number'}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    {...register('phone')}
                    disabled={isLoading}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-muted-foreground">Format: +1234567890</p>
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password') || 'Password'}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.passwordPlaceholder')}
                    {...register('password')}
                    disabled={isLoading}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters with uppercase, lowercase, and number
                  </p>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">{t('auth.confirmPassword') || 'Confirm Password'}</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder={t('auth.passwordPlaceholder')}
                    {...register('password_confirmation')}
                    disabled={isLoading}
                    className={errors.password_confirmation ? 'border-red-500' : ''}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_language_id">{t('auth.preferredLanguage') || 'Preferred Language'}</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue('preferred_language_id', value);
                      setSelectedLanguageId(value);
                      setSelectedPlanId("");
                    }}
                    disabled={isLoading || languagesLoading}
                  >
                    <SelectTrigger 
                      id="preferred_language_id"
                      className={errors.preferred_language_id ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder={t('auth.selectLanguage') || 'Select a language'} />
                    </SelectTrigger>
                    <SelectContent>
                      {languages?.map((language: any) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          {language.localized_name || language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferred_language_id && (
                    <p className="text-sm text-red-500">{errors.preferred_language_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">{t('auth.level') || 'Level'}</Label>
                  <Select
                    onValueChange={(value) => setValue('level', value as UserLevel)}
                    disabled={isLoading}
                  >
                    <SelectTrigger 
                      id="level"
                      className={errors.level ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder={t('auth.selectLevel') || 'Select your level'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserLevel.Beginner}>{t('level.beginner') || 'Beginner'}</SelectItem>
                      <SelectItem value={UserLevel.Intermediate}>{t('level.intermediate') || 'Intermediate'}</SelectItem>
                      <SelectItem value={UserLevel.Advanced}>{t('level.advanced') || 'Advanced'}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.level && (
                    <p className="text-sm text-red-500">{errors.level.message}</p>
                  )}
                </div>

                {/* Subscription Plan Selection */}
                {selectedLanguageId && subscriptionPlans && subscriptionPlans.length > 0 && (
                  <div className="space-y-3">
                    <Label>{t('auth.selectSubscriptionPlan') || 'Select Subscription Plan'} *</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {subscriptionPlans.map((plan) => (
                        <label
                          key={plan.id}
                          className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                            selectedPlanId === plan.id.toString()
                              ? 'border-primary bg-primary/5 ring-2 ring-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            value={plan.id}
                            {...register('subscription_plan_id')}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex flex-1 items-center gap-3">
                            <div className={`flex-shrink-0 ${
                              selectedPlanId === plan.id.toString() ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                              {plan.type === 'individual' ? <UserIcon size={24} /> : <Users size={24} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                  {plan.type === 'individual'
                                    ? t('subscription.individual') || 'Individual (1-on-1)'
                                    : t('subscription.group') || 'Group Learning'}
                                </span>
                                <span className="text-lg font-bold text-primary">
                                  {plan.price} DH
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {plan.sessions_per_month} {t('subscription.sessions') || 'sessions'} × {plan.session_duration_minutes} {t('subscription.minutes') || 'min'}
                                {plan.type === 'group' && plan.max_group_members && (
                                  <span className="ml-2">
                                    ({t('subscription.maxMembers') || 'Max'}: {plan.max_group_members})
                                  </span>
                                )}
                              </div>
                              {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {plan.features.slice(0, 2).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Check size={12} className="text-primary" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {selectedPlanId === plan.id.toString() && (
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Check size={16} className="text-primary-foreground" />
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.subscription_plan_id && (
                      <p className="text-sm text-red-500">{errors.subscription_plan_id.message}</p>
                    )}
                  </div>
                )}

                {selectedLanguageId && (!subscriptionPlans || subscriptionPlans.length === 0) && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('auth.noPlansAvailable') || 'No subscription plans available for this language yet.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Selected Plan Summary */}
                {selectedPlan && (
                  <Alert>
                    <AlertDescription>
                      <h4 className="font-semibold mb-2">{t('auth.selectedPlan') || 'Selected Plan'}</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>{t('auth.amount') || 'Amount'}:</strong> {selectedPlan.price} DH/month</p>
                        <p><strong>{t('auth.type') || 'Type'}:</strong> {selectedPlan.type === 'individual' ? t('subscription.individual') : t('subscription.group')}</p>
                        <p className="text-xs mt-2 text-muted-foreground">
                          {t('auth.transferThisAmount') || 'Please transfer this amount to the bank account shown in the Payment Info tab.'}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || languagesLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('auth.register') || 'Register'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

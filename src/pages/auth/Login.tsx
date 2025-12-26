import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import Logo from '../../components/common/Logo';

// Zod schema for login form validation
const loginSchema = z.object({
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isStudent, isTeacher, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success(t('auth.loginSuccess'));
      
      // Redirect based on role
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isTeacher) {
        navigate('/teacher/dashboard');
      } else if (isStudent) {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors) {
          // Display all validation errors
          Object.keys(errors).forEach(key => {
            const messages = errors[key];
            if (Array.isArray(messages)) {
              messages.forEach(msg => {
                // Check if message is a translation key
                const translatedMsg = msg.startsWith('auth.') || msg.startsWith('validation.') 
                  ? t(msg) 
                  : msg;
                toast.error(translatedMsg);
              });
            }
          });
        } else {
          toast.error(error.response?.data?.message || t('auth.loginError'));
        }
      } else {
        const errorMessage = error.response?.data?.message || t('auth.loginError');
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle id="login-title" className="text-2xl font-bold text-center">
            {t('auth.loginTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.emailPlaceholder')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-4"
            aria-labelledby="login-title"
          >
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                {...register('email')}
                disabled={isLoading}
                className={errors.email ? 'border-red-500' : ''}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p 
                  id="email-error" 
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {t(errors.email.message as string)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                {...register('password')}
                disabled={isLoading}
                className={errors.password ? 'border-red-500' : ''}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p 
                  id="password-error" 
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {t(errors.password.message as string)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.login')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              {t('common.register')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

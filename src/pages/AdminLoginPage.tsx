
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dir } = useLanguage();

  // Dummy login function - in a real app, you'd connect this to your backend
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!email || !password) {
      setError(t('validation.required'));
      return;
    }
    
    // Dummy admin credentials for demo purposes
    if (email === "admin@example.com" && password === "admin123") {
      // In a real app, you would store authentication token in local storage or context
      localStorage.setItem("adminAuthenticated", "true");
      navigate("/admin");
    } else {
      setError(t('auth.loginError'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir={dir}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo isAdmin />
          </div>
          <CardTitle className="text-2xl rtl">{t('auth.loginTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="rtl">{t('common.email')}</Label>
              <div className="relative">
                <User className={`absolute ${dir === 'rtl' ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-muted-foreground`} />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={dir === 'rtl' ? 'pr-8' : 'pl-8'}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="rtl">{t('common.password')}</Label>
              <div className="relative">
                <Lock className={`absolute ${dir === 'rtl' ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-muted-foreground`} />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={dir === 'rtl' ? 'pr-8' : 'pl-8'}
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-destructive text-center rtl">{error}</p>}
            
            <Button type="submit" className="w-full rtl">
              {t('common.login')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full rtl">{t('auth.demoCredentials', 'Demo: admin@example.com / admin123')}</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;

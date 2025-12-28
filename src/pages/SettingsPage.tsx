import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Bell,
  Globe,
  Shield,
  Palette,
  Volume2,
  Download,
  Trash2,
} from 'lucide-react';

import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      quiz: true,
      course: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showProgress: true,
      allowMessages: false,
    },
    preferences: {
      theme: 'light',
      autoPlay: true,
      soundEffects: true,
      language: language,
    },
  });

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[category as keyof typeof prev]],
      },
    }));
  };

  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const exportData = () => {
    // Implement data export functionality
    console.log('Exporting user data...');
  };

  const deleteAccount = () => {
    // Implement account deletion functionality
    console.log('Deleting account...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('button.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
              <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
              <TabsTrigger value="privacy">{t('settings.privacy')}</TabsTrigger>
              <TabsTrigger value="account">{t('settings.account')}</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('settings.language')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('settings.interfaceLanguage')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.interfaceLanguageDesc')}
                        </p>
                      </div>
                      <LanguageSelector variant="compact" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      {t('settings.appearance')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('settings.theme')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.themeDesc')}
                        </p>
                      </div>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value) => handleSelectChange('preferences', 'theme', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t('settings.light')}</SelectItem>
                          <SelectItem value="dark">{t('settings.dark')}</SelectItem>
                          <SelectItem value="system">{t('settings.system')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      {t('settings.audio')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('settings.autoPlay')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.autoPlayDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={settings.preferences.autoPlay}
                        onCheckedChange={() => handleToggle('preferences', 'autoPlay')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('settings.soundEffects')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.soundEffectsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={settings.preferences.soundEffects}
                        onCheckedChange={() => handleToggle('preferences', 'soundEffects')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t('settings.notificationPreferences')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.emailNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.emailNotificationsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={() => handleToggle('notifications', 'email')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.pushNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.pushNotificationsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={() => handleToggle('notifications', 'push')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.quizReminders')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.quizRemindersDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.quiz}
                      onCheckedChange={() => handleToggle('notifications', 'quiz')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.courseUpdates')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.courseUpdatesDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.course}
                      onCheckedChange={() => handleToggle('notifications', 'course')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.marketingEmails')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.marketingEmailsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={() => handleToggle('notifications', 'marketing')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t('settings.privacyControls')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.profileVisibility')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.profileVisibilityDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onCheckedChange={() => handleToggle('privacy', 'profileVisible')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.showProgress')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.showProgressDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.showProgress}
                      onCheckedChange={() => handleToggle('privacy', 'showProgress')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.allowMessages')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.allowMessagesDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowMessages}
                      onCheckedChange={() => handleToggle('privacy', 'allowMessages')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.dataManagement')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('settings.exportData')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.exportDataDesc')}
                        </p>
                      </div>
                      <Button variant="outline" onClick={exportData}>
                        <Download className="h-4 w-4 mr-2" />
                        {t('settings.export')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">{t('settings.dangerZone')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-red-600">{t('settings.deleteAccount')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.deleteAccountDesc')}
                        </p>
                      </div>
                      <Button variant="destructive" onClick={deleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('settings.delete')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;
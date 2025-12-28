import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  ArrowLeft,
  Trophy,
  BookOpen,
  Clock,
} from 'lucide-react';

import { useTranslation } from '../hooks/useTranslation';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    location: 'New York, USA',
    bio: 'Language enthusiast learning multiple languages.',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would call the API to update user profile
    setIsEditing(false);
  };

  const stats = [
    { label: t('profile.quizzesCompleted'), value: '24', icon: <Trophy className="h-5 w-5" /> },
    { label: t('profile.coursesEnrolled'), value: '3', icon: <BookOpen className="h-5 w-5" /> },
    { label: t('profile.studyTime'), value: '48h', icon: <Clock className="h-5 w-5" /> },
  ];

  const recentActivity = [
    { type: 'quiz', title: 'English B1 Grammar Quiz', score: '85%', date: '2 days ago' },
    { type: 'course', title: 'Spanish Conversation Course', progress: '60%', date: '1 week ago' },
    { type: 'quiz', title: 'French Vocabulary Test', score: '92%', date: '1 week ago' },
  ];

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
          <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-2xl">
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{formData.name}</h2>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {t('profile.student')}
                  </Badge>
                </div>

                <Separator className="mb-6" />

                {/* Stats */}
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {stat.icon}
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">{t('profile.personalInfo')}</TabsTrigger>
                <TabsTrigger value="activity">{t('profile.activity')}</TabsTrigger>
                <TabsTrigger value="settings">{t('profile.settings')}</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('profile.personalInfo')}</CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('button.save')}
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('button.edit')}
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('form.fullName')}</Label>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t('form.email')}</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('form.phone')}</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dob">{t('profile.dateOfBirth')}</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">{t('profile.location')}</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('profile.recentActivity')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'quiz' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {activity.type === 'quiz' ? 
                                <Trophy className="h-4 w-4 text-blue-600" /> : 
                                <BookOpen className="h-4 w-4 text-green-600" />
                              }
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {activity.score || activity.progress}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('profile.settings')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{t('profile.notifications')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('profile.notificationsDesc')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          {t('button.configure')}
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{t('profile.privacy')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('profile.privacyDesc')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          {t('button.manage')}
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-600">{t('profile.deleteAccount')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('profile.deleteAccountDesc')}
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          {t('button.delete')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
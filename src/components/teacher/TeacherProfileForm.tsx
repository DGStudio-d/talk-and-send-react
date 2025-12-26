import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateTeacherProfile, useUploadTeacherImage, useToggleTeacherVisibility } from '../../hooks/useTeachers';
import { TeacherProfile } from '../../types/models';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Upload, User } from 'lucide-react';
import { toast } from 'sonner';

const profileFormSchema = z.object({
  bio_en: z.string().min(10, t('teacher.bioMinLength')).optional().or(z.literal('')),
  bio_ar: z.string().min(10, t('teacher.bioMinLength')).optional().or(z.literal('')),
  bio_es: z.string().min(10, t('teacher.bioMinLength')).optional().or(z.literal('')),
  is_public: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface TeacherProfileFormProps {
  profile?: TeacherProfile;
  onSubmit?: (data: any) => void;
}

export const TeacherProfileForm: React.FC<TeacherProfileFormProps> = ({ profile, onSubmit }) => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const updateProfileMutation = useUpdateTeacherProfile();
  const uploadImageMutation = useUploadTeacherImage();
  const toggleVisibilityMutation = useToggleTeacherVisibility();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio_en: profile?.bio?.en || '',
      bio_ar: profile?.bio?.ar || '',
      bio_es: profile?.bio?.es || '',
      is_public: profile?.is_public ?? true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      
      await uploadImageMutation.mutateAsync(formData);
      toast.success(t('teacher.imageUploadSuccess'));
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.imageUploadError'));
    }
  };

  const handleFormSubmit = async (values: ProfileFormValues) => {
    try {
      const profileData = {
        bio: {
          en: values.bio_en || '',
          ar: values.bio_ar || '',
          es: values.bio_es || '',
        },
      };

      if (onSubmit) {
        onSubmit(profileData);
      } else {
        await updateProfileMutation.mutateAsync(profileData);
        toast.success(t('teacher.profileUpdateSuccess'));
      }

      // Handle visibility toggle if changed
      if (profile && values.is_public !== profile.is_public) {
        await toggleVisibilityMutation.mutateAsync();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.profileUpdateError'));
    }
  };

  const isLoading = updateProfileMutation.isPending || uploadImageMutation.isPending || toggleVisibilityMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.profileImage')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={imagePreview || profile?.profile_image_url} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image-upload"
                />
                <label htmlFor="profile-image-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('teacher.chooseImage')}
                    </span>
                  </Button>
                </label>
                
                {imageFile && (
                  <Button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadImageMutation.isPending}
                  >
                    {uploadImageMutation.isPending ? t('common.uploading') : t('common.upload')}
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('teacher.imageRequirements')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.bio')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">{t('common.english')}</TabsTrigger>
                  <TabsTrigger value="ar">{t('common.arabic')}</TabsTrigger>
                  <TabsTrigger value="es">{t('common.spanish')}</TabsTrigger>
                </TabsList>

                {/* English Tab */}
                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bio_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.bioEnglish')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teacher.enterBioEnglish')}
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('teacher.bioDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Arabic Tab */}
                <TabsContent value="ar" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bio_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.bioArabic')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teacher.enterBioArabic')}
                            className="min-h-32"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>
                          {t('teacher.bioDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Spanish Tab */}
                <TabsContent value="es" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bio_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('teacher.bioSpanish')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('teacher.enterBioSpanish')}
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('teacher.bioDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/* Visibility Toggle */}
              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('teacher.profileVisibility')}
                      </FormLabel>
                      <FormDescription>
                        {t('teacher.profileVisibilityDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('common.save')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

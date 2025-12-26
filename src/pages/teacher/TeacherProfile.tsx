import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Eye, EyeOff } from 'lucide-react';
import {
  useTeacherProfile,
  useUpdateTeacherProfile,
  useUploadTeacherImage,
  useToggleTeacherVisibility,
} from '../../hooks/useTeachers';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Switch } from '../../components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';

const profileFormSchema = z.object({
  bio_en: z.string().optional(),
  bio_ar: z.string().optional(),
  bio_es: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const TeacherProfile: React.FC = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading, isError, refetch } = useTeacherProfile();
  const updateProfileMutation = useUpdateTeacherProfile();
  const uploadImageMutation = useUploadTeacherImage();
  const toggleVisibilityMutation = useToggleTeacherVisibility();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio_en: '',
      bio_ar: '',
      bio_es: '',
    },
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        bio_en: profile.bio?.en || '',
        bio_ar: profile.bio?.ar || '',
        bio_es: profile.bio?.es || '',
      });
      
      if (profile.profile_image_url) {
        setImagePreview(profile.profile_image_url);
      }
    }
  }, [profile, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('profile_image', selectedFile);
      
      await uploadImageMutation.mutateAsync(formData);
      toast.success(t('teacher.imageUploadedSuccess'));
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.imageUploadedError'));
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await toggleVisibilityMutation.mutateAsync();
      toast.success(t('teacher.visibilityUpdatedSuccess'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.visibilityUpdatedError'));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const profileData = {
        bio: {
          en: values.bio_en || '',
          ar: values.bio_ar || values.bio_en || '',
          es: values.bio_es || values.bio_en || '',
        },
      };

      await updateProfileMutation.mutateAsync(profileData);
      toast.success(t('teacher.profileUpdatedSuccess'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('teacher.profileUpdatedError'));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (isError || !profile) {
    return (
      <MainLayout>
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{t('teacher.errorLoadingProfile')}</p>
            <Button onClick={() => refetch()}>{t('common.retry')}</Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{t('teacher.profile')}</h1>

        {/* Profile Image Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.profileImage')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={t('teacher.profileImage')}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                      <Upload className="w-4 h-4" />
                      <span>{t('teacher.chooseImage')}</span>
                    </div>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('teacher.imageRequirements')}
                  </p>
                </div>
                
                {selectedFile && (
                  <Button
                    onClick={handleImageUpload}
                    disabled={uploadImageMutation.isPending}
                  >
                    {uploadImageMutation.isPending ? t('common.loading') : t('teacher.uploadImage')}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Visibility Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.profileVisibility')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{t('teacher.publicProfile')}</p>
                <p className="text-sm text-gray-600">
                  {profile.is_visible
                    ? t('teacher.profileVisibleDescription')
                    : t('teacher.profileHiddenDescription')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {profile.is_visible ? (
                  <Eye className="w-5 h-5 text-green-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <Switch
                  checked={profile.is_visible}
                  onCheckedChange={handleToggleVisibility}
                  disabled={toggleVisibilityMutation.isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.bio')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormDescription>{t('teacher.optionalField')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormDescription>{t('teacher.optionalField')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? t('common.loading') : t('common.save')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TeacherProfile;

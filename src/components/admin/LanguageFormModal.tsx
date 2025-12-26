import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Language } from '../../types/models';
import { useCreateLanguage, useUpdateLanguage } from '../../hooks/useLanguages';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];

const languageFormSchema = z.object({
  name_en: z.string().min(2, 'English name must be at least 2 characters'),
  name_ar: z.string().min(2, 'Arabic name must be at least 2 characters'),
  name_es: z.string().min(2, 'Spanish name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(5, 'Code must be at most 5 characters'),
});

type LanguageFormData = z.infer<typeof languageFormSchema>;

interface LanguageFormModalProps {
  language?: Language | null;
  open: boolean;
  onClose: () => void;
}

export const LanguageFormModal: React.FC<LanguageFormModalProps> = ({
  language,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const [flagFile, setFlagFile] = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const createLanguageMutation = useCreateLanguage();
  const updateLanguageMutation = useUpdateLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: language
      ? {
          name_en: language.name_en,
          name_ar: language.name_ar,
          name_es: language.name_es,
          code: language.code,
        }
      : {
          name_en: '',
          name_ar: '',
          name_es: '',
          code: '',
        },
  });

  useEffect(() => {
    if (language) {
      reset({
        name_en: language.name_en,
        name_ar: language.name_ar,
        name_es: language.name_es,
        code: language.code,
      });
      if (language.flag_url) {
        setFlagPreview(language.flag_url);
      }
    } else {
      reset({
        name_en: '',
        name_ar: '',
        name_es: '',
        code: '',
      });
      setFlagPreview(null);
    }
    setFlagFile(null);
    setFileError(null);
  }, [language, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFlagFile(null);
      setFlagPreview(null);
      setFileError(null);
      return;
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError(t('admin.languages.invalidFileType'));
      setFlagFile(null);
      setFlagPreview(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(t('admin.languages.fileTooLarge'));
      setFlagFile(null);
      setFlagPreview(null);
      return;
    }

    setFileError(null);
    setFlagFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFlagPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: LanguageFormData) => {
    try {
      const formData = new FormData();
      formData.append('name_en', data.name_en);
      formData.append('name_ar', data.name_ar);
      formData.append('name_es', data.name_es);
      formData.append('code', data.code);

      if (flagFile) {
        formData.append('flag_image', flagFile);
      }

      if (language) {
        // Update existing language
        await updateLanguageMutation.mutateAsync({
          id: language.id,
          data: formData,
        });
        toast.success(t('admin.languages.updateSuccess'));
      } else {
        // Create new language
        await createLanguageMutation.mutateAsync(formData);
        toast.success(t('admin.languages.createSuccess'));
      }

      onClose();
    } catch (error) {
      toast.error(
        language
          ? t('admin.languages.updateError')
          : t('admin.languages.createError')
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {language ? t('admin.languages.editLanguage') : t('admin.languages.addLanguage')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* English Name */}
          <div>
            <Label htmlFor="name_en">{t('admin.languages.nameEn')}</Label>
            <Input
              id="name_en"
              {...register('name_en')}
              className={errors.name_en ? 'border-red-500' : ''}
            />
            {errors.name_en && (
              <p className="text-sm text-red-500 mt-1">{errors.name_en.message}</p>
            )}
          </div>

          {/* Arabic Name */}
          <div>
            <Label htmlFor="name_ar">{t('admin.languages.nameAr')}</Label>
            <Input
              id="name_ar"
              {...register('name_ar')}
              className={errors.name_ar ? 'border-red-500' : ''}
              dir="rtl"
            />
            {errors.name_ar && (
              <p className="text-sm text-red-500 mt-1">{errors.name_ar.message}</p>
            )}
          </div>

          {/* Spanish Name */}
          <div>
            <Label htmlFor="name_es">{t('admin.languages.nameEs')}</Label>
            <Input
              id="name_es"
              {...register('name_es')}
              className={errors.name_es ? 'border-red-500' : ''}
            />
            {errors.name_es && (
              <p className="text-sm text-red-500 mt-1">{errors.name_es.message}</p>
            )}
          </div>

          {/* Code */}
          <div>
            <Label htmlFor="code">{t('admin.languages.code')}</Label>
            <Input
              id="code"
              {...register('code')}
              className={errors.code ? 'border-red-500' : ''}
              placeholder="e.g., en, ar, es"
            />
            {errors.code && (
              <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Flag Image */}
          <div>
            <Label htmlFor="flag_image">{t('admin.languages.flagImage')}</Label>
            <Input
              id="flag_image"
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/svg+xml"
              onChange={handleFileChange}
              className={fileError ? 'border-red-500' : ''}
            />
            {fileError && <p className="text-sm text-red-500 mt-1">{fileError}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.languages.flagImageHint')}
            </p>
          </div>

          {/* Flag Preview */}
          {flagPreview && (
            <div>
              <Label>{t('admin.languages.preview')}</Label>
              <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                <img
                  src={flagPreview}
                  alt="Flag preview"
                  className="w-24 h-16 object-cover rounded"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                createLanguageMutation.isPending || updateLanguageMutation.isPending
              }
            >
              {createLanguageMutation.isPending || updateLanguageMutation.isPending
                ? t('common.saving')
                : language
                ? t('common.update')
                : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

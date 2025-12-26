import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, UserRole, UserLevel, Locale } from '../../types/models';
import { useUpdateUser, useUpdateUserRole } from '../../hooks/useUsers';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  role: z.nativeEnum(UserRole),
  level: z.nativeEnum(UserLevel),
  locale: z.nativeEnum(Locale),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, open, onClose }) => {
  const { t } = useTranslation();
  const updateUserMutation = useUpdateUser();
  const updateUserRoleMutation = useUpdateUserRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      level: user.level,
      locale: user.locale,
    },
  });

  const selectedRole = watch('role');
  const selectedLevel = watch('level');
  const selectedLocale = watch('locale');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        level: user.level,
        locale: user.locale,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      // Update user details
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          level: data.level,
          locale: data.locale,
        },
      });

      // Update role separately if changed
      if (data.role !== user.role) {
        await updateUserRoleMutation.mutateAsync({
          id: user.id,
          role: data.role,
        });
      }

      toast.success(t('admin.users.updateSuccess'));
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || t('admin.users.updateError');
      toast.error(message);
      console.error('Update error:', error.response?.data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('admin.users.editUser')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">{t('admin.users.name')}</Label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">{t('admin.users.email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">{t('admin.users.phone')}</Label>
            <Input
              id="phone"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">{t('admin.users.role')}</Label>
            <Select value={selectedRole} onValueChange={(value) => setValue('role', value as UserRole)}>
              <SelectTrigger id="role" aria-label={t('admin.users.role')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.Admin}>{t('roles.admin')}</SelectItem>
                <SelectItem value={UserRole.Teacher}>{t('roles.teacher')}</SelectItem>
                <SelectItem value={UserRole.Student}>{t('roles.student')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p id="role-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Level */}
          <div>
            <Label htmlFor="level">{t('admin.users.level')}</Label>
            <Select value={selectedLevel} onValueChange={(value) => setValue('level', value as UserLevel)}>
              <SelectTrigger id="level" aria-label={t('admin.users.level')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserLevel.Beginner}>{t('levels.beginner')}</SelectItem>
                <SelectItem value={UserLevel.Intermediate}>{t('levels.intermediate')}</SelectItem>
                <SelectItem value={UserLevel.Advanced}>{t('levels.advanced')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && (
              <p id="level-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.level.message}
              </p>
            )}
          </div>

          {/* Locale */}
          <div>
            <Label htmlFor="locale">{t('admin.users.locale')}</Label>
            <Select value={selectedLocale} onValueChange={(value) => setValue('locale', value as Locale)}>
              <SelectTrigger id="locale" aria-label={t('admin.users.locale')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Locale.English}>{t('languages.english')}</SelectItem>
                <SelectItem value={Locale.Arabic}>{t('languages.arabic')}</SelectItem>
                <SelectItem value={Locale.Spanish}>{t('languages.spanish')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.locale && (
              <p id="locale-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.locale.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending || updateUserRoleMutation.isPending}
            >
              {updateUserMutation.isPending || updateUserRoleMutation.isPending
                ? t('common.saving')
                : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

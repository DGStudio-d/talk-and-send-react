import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserRole, UserLevel, Locale } from '../../types/models';
import { authApi } from '../../lib/api';
import { useQueryClient } from '@tanstack/react-query';
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

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole),
  level: z.nativeEnum(UserLevel),
  locale: z.nativeEnum(Locale),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: UserRole.Student,
      level: UserLevel.Beginner,
      locale: Locale.English,
    },
  });

  const selectedRole = watch('role');
  const selectedLevel = watch('level');
  const selectedLocale = watch('locale');

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await authApi.register(data);
      toast.success(t('admin.users.createSuccess'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || t('admin.users.createError');
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('admin.users.createUser')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('admin.users.name')}</Label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">{t('admin.users.email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">{t('admin.users.phone')}</Label>
            <Input
              id="phone"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">{t('admin.users.password')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role">{t('admin.users.role')}</Label>
            <Select value={selectedRole} onValueChange={(value) => setValue('role', value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.Admin}>{t('roles.admin')}</SelectItem>
                <SelectItem value={UserRole.Teacher}>{t('roles.teacher')}</SelectItem>
                <SelectItem value={UserRole.Student}>{t('roles.student')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="level">{t('admin.users.level')}</Label>
            <Select value={selectedLevel} onValueChange={(value) => setValue('level', value as UserLevel)}>
              <SelectTrigger id="level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserLevel.Beginner}>{t('levels.beginner')}</SelectItem>
                <SelectItem value={UserLevel.Intermediate}>{t('levels.intermediate')}</SelectItem>
                <SelectItem value={UserLevel.Advanced}>{t('levels.advanced')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="locale">{t('admin.users.locale')}</Label>
            <Select value={selectedLocale} onValueChange={(value) => setValue('locale', value as Locale)}>
              <SelectTrigger id="locale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Locale.English}>{t('languages.english')}</SelectItem>
                <SelectItem value={Locale.Arabic}>{t('languages.arabic')}</SelectItem>
                <SelectItem value={Locale.Spanish}>{t('languages.spanish')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.creating') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

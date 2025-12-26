import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    className: 'bg-green-500 hover:bg-green-600 text-white',
    ariaLabel: 'Success status',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-500 hover:bg-red-600 text-white',
    ariaLabel: 'Error status',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    ariaLabel: 'Warning status',
  },
  info: {
    icon: Info,
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
    ariaLabel: 'Info status',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  className,
  showIcon = true,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(config.className, className)}
      aria-label={config.ariaLabel}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" aria-hidden="true" />}
      {children}
    </Badge>
  );
};

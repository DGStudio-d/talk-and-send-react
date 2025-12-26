import React, { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({ label, value, icon: Icon, className }) => {
  const labelId = useMemo(() => `stat-label-${label.replace(/\s+/g, '-')}`, [label]);

  return (
    <Card className={className} role="article" aria-label={`${label}: ${value}`}>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1" id={labelId}>
            {label}
          </p>
          <p 
            className="text-3xl font-bold text-gray-900"
            aria-labelledby={labelId}
          >
            {value}
          </p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div 
            className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center"
            aria-hidden="true"
          >
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

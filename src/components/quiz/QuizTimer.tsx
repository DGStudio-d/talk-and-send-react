import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface QuizTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ durationMinutes, onTimeUp }) => {
  const { t } = useTranslation();
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);

  useEffect(() => {
    // Set up interval to update timer every second
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [onTimeUp]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if time is running low (last 2 minutes)
  const isLowTime = secondsRemaining <= 120;

  return (
    <Card 
      className={cn(
        'transition-colors',
        isLowTime && 'border-red-500 bg-red-50'
      )}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={t('quiz.timerLabel', { time: formatTime(secondsRemaining) })}
    >
      <CardContent className="py-4">
        <div className="flex items-center justify-center gap-3">
          {isLowTime ? (
            <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
          ) : (
            <Clock className="w-5 h-5 text-primary-600" aria-hidden="true" />
          )}
          <div className="text-center">
            <p 
              className={cn(
                'text-2xl font-bold tabular-nums',
                isLowTime ? 'text-red-600' : 'text-primary-600'
              )}
              aria-hidden="true"
            >
              {formatTime(secondsRemaining)}
            </p>
            <p className={cn(
              'text-xs',
              isLowTime ? 'text-red-600' : 'text-muted-foreground'
            )}>
              {t('quiz.timeRemaining')}
            </p>
          </div>
        </div>
        {isLowTime && (
          <span className="sr-only" role="alert">
            {t('quiz.lowTimeWarning', { time: formatTime(secondsRemaining) })}
          </span>
        )}
      </CardContent>
    </Card>
  );
};

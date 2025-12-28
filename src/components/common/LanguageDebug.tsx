import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LanguageDebug: React.FC = () => {
  const { language, dir, t } = useLanguage();
  const [domState, setDomState] = useState({
    documentDir: '',
    documentLang: '',
    bodyClasses: ''
  });

  // Only show in development mode
  const isDevelopment = import.meta.env.DEV;

  // Update DOM state every 100ms to catch changes
  useEffect(() => {
    if (!isDevelopment) return;

    const updateDomState = () => {
      setDomState({
        documentDir: document.documentElement.dir,
        documentLang: document.documentElement.lang,
        bodyClasses: document.body.className.split(' ').filter(c => c === 'rtl' || c === 'ltr').join(', ') || 'none'
      });
    };

    updateDomState();
    const interval = setInterval(updateDomState, 100);

    return () => clearInterval(interval);
  }, [language, dir, isDevelopment]);

  // Don't render anything in production
  if (!isDevelopment) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4 border-dashed border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800 flex items-center gap-2">
          🔧 Language Debug Info (Dev Mode Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current Language:</span>
          <Badge variant="outline">{language}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Direction:</span>
          <Badge variant="outline">{dir}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Document Dir:</span>
          <Badge variant={domState.documentDir === dir ? "default" : "destructive"}>
            {domState.documentDir}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Document Lang:</span>
          <Badge variant={domState.documentLang === language ? "default" : "destructive"}>
            {domState.documentLang}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Body Classes:</span>
          <Badge variant={domState.bodyClasses.includes(dir) ? "default" : "destructive"} className="text-xs">
            {domState.bodyClasses}
          </Badge>
        </div>
        <div className="mt-4 p-2 bg-muted rounded">
          <p className="text-sm">
            <strong>Sample Translation:</strong><br />
            {t('nav.home')} | {t('nav.languages')} | {t('button.register')}
          </p>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Status: {
            domState.documentDir === dir && 
            domState.documentLang === language && 
            domState.bodyClasses.includes(dir) 
              ? '✅ Synchronized' 
              : '❌ Out of sync'
          }
        </div>
        <div className="mt-2 text-xs text-orange-600 font-medium">
          This debug panel only appears in development mode
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageDebug;
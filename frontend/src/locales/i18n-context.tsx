'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { LOCALE_STORAGE_KEY } from '@/constants/STORAGE_KEYS';
import enTranslations from '@/locales/en.json';
import viTranslations from '@/locales/vi.json';

export type Locale = 'vi' | 'en';

type Translations = typeof viTranslations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
}

const dictionaries: Record<Locale, any> = {
  vi: viTranslations,
  en: enTranslations,
};

const I18nContext = createContext<I18nContextType | null>(null);

/**
 * Provides translation context and language switcher for Windie Cake application.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    if (savedLocale === 'vi' || savedLocale === 'en') {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'vi' ? 'en' : 'vi');
  };

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let current = dictionaries[locale];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Vietnamese if key not found
        let fallback = dictionaries.vi;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            return keyPath;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return keyPath;
    }

    if (!params) {
      return current;
    }

    return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
      return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }, current);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access current translation dictionary and locale controls.
 */
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

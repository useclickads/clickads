'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { t as translate, type Locale, getAvailableLocales } from './translations';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  availableLocales: Array<{ code: Locale; name: string }>;
};

export const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
  availableLocales: getAvailableLocales(),
});

export function useI18n() {
  return useContext(I18nContext);
}

export function useI18nProvider() {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('nova_locale') : null;
  const [locale, setLocaleState] = useState<Locale>((stored as Locale) || 'en');

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nova_locale', newLocale);
    }
  }, []);

  const t = useCallback((key: string) => translate(key, locale), [locale]);

  return {
    locale,
    setLocale,
    t,
    availableLocales: getAvailableLocales(),
  };
}

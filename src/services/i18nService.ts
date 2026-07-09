import en from '../data/translations/en.json';
import es from '../data/translations/es.json';
import hi from '../data/translations/hi.json';
import fr from '../data/translations/fr.json';
import ar from '../data/translations/ar.json';
import { AppLanguage } from '../types';

const translations: Record<AppLanguage, any> = {
  en,
  es,
  hi,
  fr,
  ar
};

/**
 * Resolves translation lookup keys (e.g., 'app.title') to localized strings.
 * Falls back dynamically to English translation if key is missing in chosen target locale.
 *
 * @param {string} key - Nested translation dictionary dot-notation path.
 * @param {AppLanguage} [lang='en'] - Target ISO locale code (en, es, hi, fr, ar).
 * @returns {string} The localized text string or key itself if resolution fails.
 * 
 * Serves Area 6 (Multilingual assistance)
 */
export function translate(key: string, lang: AppLanguage = 'en'): string {
  const dict = translations[lang] || translations['en'];
  const parts = key.split('.');
  
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      if (lang !== 'en') {
        return translate(key, 'en');
      }
      return key; // Return the key as fallback
    }
  }

  return typeof current === 'string' ? current : key;
}

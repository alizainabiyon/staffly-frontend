import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export async function resolveI18n() {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('locale')?.value;
  const locale = cookieLocale === 'ur' ? 'ur' : 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
}

export default getRequestConfig(async () => {
  const { locale, messages } = await resolveI18n();
  return { locale, messages };
});
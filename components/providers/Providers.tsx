'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/lib/store/store';
import { AuthInitializer } from './AuthInitializer';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthInitializer />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
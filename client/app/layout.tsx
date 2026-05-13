import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { NextUIProvider } from '@/providers/NextUIProvider';
import { MoodProvider } from '@/providers/MoodProvider';
import { GrainOverlay } from '@/components/atmosphere/GrainOverlay'
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from 'sonner';

const display = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '500', '600'],
  variable: '--font-display',
});
const body = DM_Sans({
  subsets: ['latin'], variable: '--font-body',
});

export const metadata: Metadata = {
  title: '3:17 AM — Midnight Archive',
  description: 'Some thoughts only exist at night.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <body className="bg-night-900 text-[#F5F3FF] font-body antialiased">
        <NextUIProvider>
          <MoodProvider>
            <AuthProvider>
              <GrainOverlay />
              {children}
              <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: 'rgba(11, 16, 32, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    color: 'rgba(245, 243, 255, 0.85)',
                    fontSize: '13px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  },
                  className: 'font-body',
                }}
              />
            </AuthProvider>
          </MoodProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { Providers } from './providers';
import { SidebarNavigation, GlobalAudioPlayer, SettingsDrawer, Footer } from '@/components/organisms';
import { validateServerEnv } from '@/lib/env';
import './globals.css';

// Validate environment variables on the server
validateServerEnv();

export const metadata: Metadata = {
  title: 'Al-Quran Interactive — Your Spiritual Knowledge Hub',
  description: 'A premium Islamic knowledge platform with immersive Quran reading, audio synchronization, scholarly video content, and deep Tafseer research.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logo.png?v=3" type="image/png" />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>
          <div className="flex min-h-screen min-[1200px]:flex-col">
            {/* Sidebar Navigation */}
            <SidebarNavigation isOpen={true} />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 min-[1200px]:ml-0 min-[1200px]:pt-20 min-h-screen flex flex-col">
              <div className="flex-1 pb-16">
                {children}
              </div>
              <Footer />
            </main>

            {/* Global Floating Components */}
            <GlobalAudioPlayer />
            <SettingsDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

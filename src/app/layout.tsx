export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import './globals.css';
import './themes.css';
import { cookies } from "next/headers"
import { cn } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from 'sonner';
// import ThemeProvider from '@/components/theme/Provider';
import configManager from '@/lib/config';
import SetupWizard from '@/components/Setup/SetupWizard';
import { ChatProvider } from '@/lib/hooks/useChat';
import GoogleOneTap from '@/components/auth/GoogleOneTap';
import { SessionProvider } from '@/lib/hooks/useSession';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ExtractPanelProvider } from '@/contexts/ExtractPanelContext';

export const metadata: Metadata = {
  title: 'QwkSearch - Chat with the internet',
  description:
    'QwkSearch is an AI powered chatbot that is connected to the internet.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setupComplete = configManager.isSetupComplete();
  const configSections = configManager.getUIConfigSections();

  const cookieStore = await cookies()
  const theme = cookieStore.get("color-theme")?.value || "modern-minimal"

  return (
    <html lang="en" suppressHydrationWarning className={`theme-${theme}`}>
      <body className={cn('h-full', 'font-sans')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >          <SessionProvider>
            {/* {setupComplete ? ( */}
            <ExtractPanelProvider>
              <ChatProvider>
                <GoogleOneTap />
                <Sidebar>{children}</Sidebar>
                <Toaster
                  toastOptions={{
                    unstyled: true,
                    classNames: {
                      toast:
                        'bg-light-secondary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
                    },
                  }}
                />
              </ChatProvider>
            </ExtractPanelProvider>
            {/* ) : (
              <SetupWizard configSections={configSections} />
            )} */}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

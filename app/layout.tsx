import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalsProvider } from "@/components/providers/modals-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "A discord clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-white dark:bg-[#313338]">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="discord-clone-theme">
            <SocketProvider>
              <ModalsProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

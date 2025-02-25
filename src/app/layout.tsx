import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ChatProvider } from "./providers/ChatProvider"; // ✅ ChatProvider ইম্পোর্ট

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ollama Chat",
  description: "A chat interface for Ollama AI models",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChatProvider> {/* ✅ now I am able to ue usechat in whole app */}
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {children}
            </div>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s - Meal Buildr", absolute: "Meal Buildr" },
  description: "Generate raw dog food meal suggestions in minutes.",
  openGraph: {
    title: "Meal Buildr",
    description: "Generate raw dog food meal suggestions in minutes.",
    url: "https://ai-buildr.vercel.app",
    type: "website",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/7071536c-e07a-41ca-8e08-6cadbfd90cba.jpg?token=CrhA5U0QWZwxxRpvxCkenud6A2MOdnhoidZ7wUJ6s0U&height=900&width=1200&expires=33270290080",
        width: 1200,
        height: 900,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meal Buildr",
    description: "Generate raw dog food meal suggestions in minutes.",
    images: [
      "https://opengraph.b-cdn.net/production/images/7071536c-e07a-41ca-8e08-6cadbfd90cba.jpg?token=CrhA5U0QWZwxxRpvxCkenud6A2MOdnhoidZ7wUJ6s0U&height=900&width=1200&expires=33270290080",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "./components/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Short URL - Create & Track Shortened Links",
  description: "Create beautiful short URLs, track clicks, and manage your links with ease. Fast, secure, and easy to use.",
};

/**
 * Root HTML layout applied to every route: sets up fonts, wraps the app in ClerkProvider for authentication, and renders the persistent navigation bar around the page content.
 * @param children - The page content to render inside the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Navigation />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ClerkProvider, Show, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
          <header className="border-b">
            <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Short URL
              </div>
              <div className="flex gap-4">
                <Show when="signed-out">
                  <Link href="/sign-in">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Sign Up</Button>
                  </Link>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

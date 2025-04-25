import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />

            <main className="container mx-auto max-w-7xl py-8 px-6 flex-grow">
              <div className="flex w-full flex-col gap-3 p-4 mb-6 rounded-xl bg-yellow-100 dark:bg-yellow-600">
                <span>Projeto está em desenvolvimento</span>
                <span className="text-sm">
                  Diversas funcionalidades adicionais estão em fase de
                  planejamento, incluindo a transcrição de vídeos, imagens e
                  áudios, decks e cards ainda não implementados.
                </span>
              </div>
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <div className="flex items-center gap-1 text-current">
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">DinoDecks</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

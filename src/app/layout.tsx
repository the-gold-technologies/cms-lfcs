import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/styles/quill-custom.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "";
  let siteTitle = "LFCS School CMS";

  try {
    const config = await prisma.globalConfig.findUnique({
      where: { id: "global" },
      select: { favicon: true, siteTitle: true },
    });
    if (config?.favicon) {
      faviconUrl = config.favicon;
    }
    if (config?.siteTitle) {
      siteTitle = `${config.siteTitle} — CMS`;
    }
  } catch (error) {
    console.error("Error generating CMS metadata:", error);
  }

  return {
    title: siteTitle,
    description: "Management Portal for Little Flower Group of Schools",
    ...(faviconUrl
      ? {
          icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let faviconUrl = "";
  try {
    const config = await prisma.globalConfig.findUnique({
      where: { id: "global" },
      select: { favicon: true },
    });
    faviconUrl = config?.favicon || "";
  } catch (error) {
    console.error("Error loading favicon in RootLayout:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {faviconUrl ? (
          <>
            <link rel="icon" href={faviconUrl} />
            <link rel="shortcut icon" href={faviconUrl} />
            <link rel="apple-touch-icon" href={faviconUrl} />
          </>
        ) : null}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#f8f9fa]`}
        suppressHydrationWarning
      >
        <SessionProvider session={session}>
          {session ? (
            <div className="flex h-screen overflow-hidden font-sans p-[5px]">
              <AdminSidebar favicon={faviconUrl} />
              <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-10 py-8">{children}</div>
              </main>
            </div>
          ) : (
            <div className="font-sans min-h-screen">{children}</div>
          )}
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: "var(--font-inter)", fontSize: "13px", borderRadius: "12px" },
            error: {
              style: {
                background: "#fff0f0",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              },
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

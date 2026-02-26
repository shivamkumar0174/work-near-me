import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Work Near Me — Find Local Gigs & Jobs",
  description:
    "Hire local talent or find work in your city. Work Near Me connects people for small jobs, gigs, and freelance work in their neighbourhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* AuthSessionProvider makes useSession() available everywhere */}
        <AuthSessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}

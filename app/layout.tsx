import { League_Spartan } from "next/font/google";
import { AppSidebar} from "@/components/invoices/AppSidebar";
import "./globals.css";
import {ThemeProvider} from "@/components/theme/ThemeProvider";
import Providers from "@/app/providers";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: '--font-leagueSpartan',
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html lang="en" suppressHydrationWarning className={`${leagueSpartan.variable} h-full antialiased`}>
      <body className="h-full flex flex-col">
      <Providers>
      <ThemeProvider>
        <AppSidebar />
        <main className="min-h-screen flex-1 pt-20 md:ml-[103px] md:pt-0">{children}</main>
      </ThemeProvider>
      </Providers>
      </body>
      </html>
  );
}

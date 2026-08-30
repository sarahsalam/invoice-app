import localFont from "next/font/local";
import { AppSidebar} from "@/components/invoices/AppSidebar";
import "./globals.css";
import {ThemeProvider} from "@/components/theme/ThemeProvider";
import Providers from "@/app/providers";

const spartan = localFont({
    src: [
        { path: "../public/fonts/Spartan-Thin-250.ttf", weight: "100" },
        { path: "../public/fonts/Spartan-ExtraLight-250.ttf", weight: "200" },
        { path: "../public/fonts/Spartan-Light-300.ttf", weight: "300" },
        { path: "../public/fonts/Spartan-Regular-400.ttf", weight: "400" },
        { path: "../public/fonts/Spartan-Medium-500.ttf", weight: "500" },
        { path: "../public/fonts/Spartan-SemiBold-600.ttf", weight: "600" },
        { path: "../public/fonts/Spartan-Bold-700.ttf", weight: "700" },
        { path: "../public/fonts/Spartan-ExtraBold-800.ttf", weight: "800" },
        { path: "../public/fonts/Spartan-Black-900.ttf", weight: "900" },
    ],
    variable: "--font-spartan",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" suppressHydrationWarning className={`${spartan.variable} h-full antialiased`}>
        <body suppressHydrationWarning className="h-full flex flex-col">
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
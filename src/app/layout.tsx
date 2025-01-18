import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "scoreKeeperQR",
    template: "%s | scoreKeeperQR",
  },
  description: "Tournament mangement system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className={inter.className}>
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}

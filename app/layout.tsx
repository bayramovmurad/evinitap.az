import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({subsets:["latin"], weight:['500']})

export const metadata: Metadata = {
  title: "Evinitap.az",
  description: "Getdiyniz her yerde eviniz yaninizda olsun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

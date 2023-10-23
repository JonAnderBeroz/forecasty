import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forecasty",
  description: "Weather forecast app",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="flex flex-col w-100 h-100 p-4 items-center ">{children}</body>
    </html>
  );
}

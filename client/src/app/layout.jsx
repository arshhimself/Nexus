
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import { Toaster } from "sonner";
import ContextWrapper from "./context";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexus",
  description: "An OpenSource Community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
 <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
              border: "1px solid #333",
            },
          }}
        />
        
<ContextWrapper>
          <NavBar/>
          {children}
      </ContextWrapper>
      </body>
    </html>
  );
}

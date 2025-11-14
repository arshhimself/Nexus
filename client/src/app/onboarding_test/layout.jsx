import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"
export default function Layout({ children }) {
  return (
    <html lang="en">
       <body>
        <Toaster richColors position="top-right" />
        {children}
        <Analytics />
        </body>
    </html>
  )
}

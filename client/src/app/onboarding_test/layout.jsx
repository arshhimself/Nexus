import { Toaster } from "sonner";
export default function Layout({ children }) {
  return (
    <html lang="en">
       <body>
        <Toaster richColors position="top-right" />
        {children}
        </body>
    </html>
  )
}

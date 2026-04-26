import "./globals.css";

export const metadata = {
  title: "Micron Aerosols — Digital Visibility Manager",
  description: "AI-powered digital visibility plan for every product on micronaero.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}

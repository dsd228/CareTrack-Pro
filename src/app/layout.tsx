import type { Metadata } from "next";
import "../../styles/globals.css";
import ClientLayout from '../../components/ClientLayout'

export const metadata: Metadata = {
  title: "CareTrack Pro",
  description: "Plataforma profesional de gestión de pacientes para enfermería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

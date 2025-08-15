import './globals.css'

export const metadata = {
  title: 'CareTrack Pro - Plataforma Educativa para Enfermería',
  description: 'Plataforma profesional de gestión de pacientes y educación para estudiantes de enfermería',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
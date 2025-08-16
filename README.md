# CareTrack Pro

Plataforma profesional de gestión de pacientes para enfermería, construida con Next.js, Tailwind CSS y TypeScript.

## 🚀 Características

- **Next.js 15** con App Router y TypeScript
- **Tailwind CSS** con soporte para modo oscuro/claro
- **Diseño responsivo** y accesible
- **Arquitectura modular** con componentes reutilizables
- **ESLint y Prettier** configurados para mantener código consistente
- **Tipado estricto** con TypeScript

## 📁 Estructura del Proyecto

```
CareTrack-Pro/
├── components/           # Componentes reutilizables
│   ├── Header.tsx       # Componente de cabecera
│   ├── Sidebar.tsx      # Barra lateral de navegación
│   └── Layout.tsx       # Layout principal
├── lib/                 # Utilidades y configuraciones
│   └── theme.ts         # Gestión de temas (modo oscuro/claro)
├── src/app/             # Páginas usando App Router
│   ├── page.tsx         # Dashboard principal
│   ├── pacientes/       # Gestión de pacientes
│   ├── reportes/        # Reportes del sistema
│   └── configuracion/   # Configuración
├── styles/              # Estilos globales
│   └── globals.css      # CSS global con Tailwind
├── tests/               # Tests del proyecto
│   └── ejemplo.test.ts  # Ejemplo de test
└── public/              # Archivos estáticos
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18.0 o superior
- npm o yarn

### Pasos para instalar

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/dsd228/CareTrack-Pro.git
   cd CareTrack-Pro
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📝 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🎨 Funcionalidades

### Dashboard
- Vista general con estadísticas
- Tarjetas informativas de pacientes, citas, reportes y alertas
- Diseño responsivo y adaptativo

### Navegación
- **Dashboard**: Pantalla principal con resumen
- **Pacientes**: Gestión y administración de pacientes
- **Reportes**: Análisis y reportes del sistema
- **Configuración**: Configuración del sistema

### Modo Oscuro/Claro
- Alternancia manual con botón en el header
- Remembranza de la preferencia del usuario
- Respeta la preferencia del sistema operativo

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 15
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons
- **Fuentes**: Inter (Google Fonts)
- **Calidad de código**: ESLint + Prettier

## 🚧 Próximas Características

- Sistema de autenticación
- Conexión con backend/API
- Gestión completa de pacientes
- Sistema de reportes avanzado
- Configuraciones personalizables

## 🤝 Contribución

Este proyecto está preparado para futuras contribuciones. La estructura modular permite añadir fácilmente nuevas características.

## 📄 Licencia

Este proyecto es para uso educativo y profesional en el ámbito de la enfermería.

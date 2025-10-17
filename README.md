# 🌸 ControlCiclo - Seguimiento de Ciclo Menstrual

Una aplicación web moderna y minimalista para el seguimiento del ciclo menstrual, construida con Next.js 15 y React 19.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)

## ✨ Características

- 📅 **Calendario Visual**: Visualiza tu ciclo completo con indicadores de colores
- 🔮 **Predicción Inteligente**: Predice tus próximos periodos basándose en tu ciclo
- 🌱 **Ventana Fértil**: Identifica automáticamente tu ventana fértil (días 10-17)
- 📝 **Registro de Síntomas**: Lleva un diario detallado de tus síntomas
- 📊 **Estadísticas**: Visualiza tendencias y patrones de tu ciclo
- ⚙️ **Personalización**: Configura la duración de tu ciclo y periodo
- 🌙 **Modo Oscuro**: Soporte completo para tema claro/oscuro
- 📱 **PWA (Progressive Web App)**: Instálala como app nativa en tu dispositivo
- 🔄 **Sincronización en la Nube**: Accede a tus datos desde cualquier dispositivo
- 🔐 **Autenticación con Google**: Login seguro y rápido
- ☁️ **Firebase Backend**: Almacenamiento seguro en Firestore

## 📱 Instalación como PWA (Usuarios)

ControlCiclo es una **Progressive Web App (PWA)** que puedes instalar en tu dispositivo:

### En Móvil (Android/iOS):

1. Abre https://controlciclo.vercel.app en tu navegador (Chrome, Safari, etc.)
2. Busca el botón **"Instalar App"** (icono de descarga ⬇️) en el header
3. O usa el menú del navegador → "Agregar a pantalla de inicio"
4. ¡Listo! Ahora puedes usar ControlCiclo como una app nativa

### En Escritorio (Chrome/Edge):

1. Abre la app en tu navegador
2. Busca el icono de instalación en la barra de direcciones
3. Haz clic en **"Instalar"**
4. La app se abrirá en su propia ventana

### Beneficios de la PWA:

- ✅ Funciona offline (con datos en cache)
- ✅ Acceso rápido desde tu pantalla de inicio
- ✅ Experiencia similar a una app nativa
- ✅ Actualizaciones automáticas
- ✅ Sin necesidad de App Store o Play Store
- ✅ Notificaciones push (próximamente)

## 🚀 Inicio Rápido (Desarrolladores)

### Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **pnpm** (gestor de paquetes)

#### Instalar pnpm

Si no tienes pnpm instalado, puedes instalarlo de las siguientes formas:

**Usando npm:**
```bash
npm install -g pnpm
```

**Usando Windows PowerShell:**
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**Usando Chocolatey (Windows):**
```bash
choco install pnpm
```

**Usando Scoop (Windows):**
```bash
scoop install pnpm
```

### Instalación

1. **Clona el repositorio** (si aún no lo has hecho):
```bash
git clone <tu-repositorio>
cd controlciclo
```

2. **Instala las dependencias**:
```bash
pnpm install
```

3. **Configura las variables de entorno**:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

4. **Configura Firebase**:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita **Authentication** → **Google Sign-In**
   - Habilita **Firestore Database**
   - Configura las reglas de Firestore (ver [`FIRESTORE-RULES.md`](./FIRESTORE-RULES.md))

5. **Genera los iconos PWA** (Opcional):
   - Para habilitar la instalación PWA completa, crea iconos en `public/`:
     - `icon-192.png` (192x192 píxeles)
     - `icon-512.png` (512x512 píxeles)
     - `favicon.ico`
   - Luego actualiza `public/manifest.json` para incluir los iconos
   - **Nota**: La app funciona sin iconos, pero no será completamente instalable como PWA

6. **Inicia el servidor de desarrollo**:
```bash
pnpm dev
```

7. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

¡Listo! La aplicación debería estar funcionando.

## 📦 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Ejecutar linter
pnpm lint
```

## 🛠️ Tecnologías Utilizadas

### Core
- **[Next.js 15](https://nextjs.org/)** - Framework de React
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de CSS

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI reutilizables
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos

### Utilidades
- **[date-fns](https://date-fns.org/)** - Manipulación de fechas
- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestión de temas
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificaciones toast

### Gráficos y Visualización
- **[Recharts](https://recharts.org/)** - Gráficos para estadísticas

## 📁 Estructura del Proyecto

```
controlciclo/
├── app/                      # App Router de Next.js
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página de inicio
│   └── globals.css          # Estilos globales
│
├── components/              # Componentes de React
│   ├── ui/                  # Componentes de UI (shadcn)
│   ├── calendar-view.tsx    # Vista principal del calendario
│   ├── onboarding-flow.tsx  # Flujo de onboarding inicial
│   ├── settings-view.tsx    # Panel de configuración
│   ├── statistics-view.tsx  # Panel de estadísticas
│   ├── symptom-log-modal.tsx # Modal para registrar síntomas
│   └── theme-provider.tsx   # Proveedor de tema
│
├── hooks/                   # Custom hooks
│   ├── use-mobile.ts        # Hook para detección móvil
│   └── use-toast.ts         # Hook para notificaciones
│
├── lib/                     # Utilidades
│   └── utils.ts             # Funciones helper
│
├── public/                  # Archivos estáticos
│
└── styles/                  # Estilos adicionales
```

## 🎨 Características Principales

### 1. Autenticación
Al abrir la aplicación por primera vez, necesitarás iniciar sesión con tu cuenta de Google para acceder a tus datos.

### 2. Bienvenida Inicial
Una vez autenticada, se te guiará a través de un proceso de configuración donde podrás:
- Ingresar la fecha de tu último periodo
- Configurar la duración promedio de tu ciclo
- Establecer la duración promedio de tu periodo

### 3. Vista de Calendario
El calendario muestra:
- **Días de periodo** (marcados en color primario)
- **Periodos predichos** (marcados en color primario translúcido)
- **Ventana fértil** (marcados en color secundario)
- **Día actual** (con un anillo alrededor)

### 4. Registro de Síntomas
Puedes registrar:
- Síntomas físicos (dolores, fatiga, etc.)
- Estado de ánimo
- Flujo
- Notas adicionales

### 5. Estadísticas
Visualiza:
- Duración promedio del ciclo
- Patrones de síntomas
- Tendencias a lo largo del tiempo

## 💾 Almacenamiento de Datos

Los datos se almacenan de forma segura en **Firestore** (base de datos en la nube de Google):

- **Autenticación**: Requiere cuenta de Google para acceder
- **Sincronización**: Tus datos se sincronizan automáticamente entre todos tus dispositivos
- **Estructura**: `apps/controlciclo/users/{userId}/data/`
  - `userData` - Configuración del usuario (ciclo, periodo, última fecha)
  - `periodLogs` - Registros de periodos
  - `symptomLogs` - Registros de síntomas y estado de ánimo

> **Nota**: Solo tú puedes acceder a tus datos. Se requiere autenticación con Google.

## 🔒 Privacidad y Seguridad

Esta aplicación respeta completamente tu privacidad:
- ✅ **Autenticación segura** - Login con Google OAuth 2.0
- ✅ **Datos encriptados** - Tu información se almacena de forma segura en Firestore
- ✅ **Sin tracking** - No rastreamos tu actividad personal
- ✅ **Acceso privado** - Solo tú puedes ver tus datos (reglas de seguridad de Firestore)
- ✅ **Sincronización segura** - Datos sincronizados solo en tus dispositivos autenticados
- ✅ **PWA Segura** - Service Worker y HTTPS requeridos
- ✅ **Sin terceros** - No compartimos datos con nadie

## 🌐 Despliegue

### Desplegar en Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Vercel detectará automáticamente Next.js y configurará todo

### Desplegar en Netlify

1. Sube tu código a GitHub
2. Conecta el repositorio en [Netlify](https://netlify.com)
3. Configura el comando de build: `pnpm build`
4. Configura el directorio de publicación: `.next`

### Desplegar en otros servicios

Para otros servicios que soporten Next.js:

```bash
# Compilar la aplicación
pnpm build

# Iniciar en producción
pnpm start
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Exportar datos a CSV
- [ ] Gráficos más avanzados
- [ ] Recordatorios y notificaciones
- [ ] Integración con calendario del sistema
- [ ] Modo sin conexión mejorado (PWA)
- [ ] Múltiples perfiles

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes una sugerencia, por favor abre un [issue](https://github.com/tu-usuario/controlciclo/issues).

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes increíbles
- [Radix UI](https://www.radix-ui.com/) por los primitivos accesibles
- [Vercel](https://vercel.com/) por Next.js

---

Hecho con ❤️ para hacer el seguimiento del ciclo menstrual más fácil y privado.


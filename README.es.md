# TrainNote

Aplicación web para registrar entrenamientos, alimentación, peso corporal y consultar el progreso fitness de una persona. También permite generar planes personalizados de entrenamiento o nutrición mediante inteligencia artificial.

## Descripción

TrainNote es una plataforma donde los usuarios pueden crear una cuenta y gestionar su información fitness desde un solo lugar.

Los usuarios pueden registrar sus entrenamientos diarios, incluyendo ejercicios, series, repeticiones, peso utilizado y duración.

También pueden registrar sus comidas, calorías, proteínas, carbohidratos y grasas, además de llevar un control de su peso corporal.

La aplicación utiliza los datos registrados para mostrar el progreso del usuario mediante estadísticas y gráficos.

TrainNote también permite generar planes personalizados con inteligencia artificial. El usuario puede seleccionar entre un plan de entrenamiento o un plan de nutrición y completar los datos necesarios para obtener una recomendación adaptada a sus objetivos.

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Recuperación de contraseña.
- Consulta y actualización del perfil.
- Registro de entrenamientos.
- Registro de ejercicios, series, repeticiones y peso utilizado.
- Registro de comidas.
- Registro del peso corporal.
- Consulta del progreso.
- Gráficos de evolución del peso.
- Consulta del historial de registros.
- Generación de planes de entrenamiento con inteligencia artificial.
- Generación de planes de nutrición con inteligencia artificial.

## Tecnologías utilizadas

### Frontend

- **React** — librería principal para la construcción de la interfaz.
- **React Router DOM** — manejo de rutas y navegación.
- **Tailwind CSS** — estilos y diseño responsivo.
- **Chart.js** — gráficos de evolución de peso y progreso.
- **Material Symbols (Google Fonts)** — iconografía de la interfaz.
- **Cloudinary** — almacenamiento y entrega de imágenes de perfil (subida de avatar).
- **Context API / useReducer (patrón Flux)** — manejo del estado global de la aplicación.

### Backend

- **Python 3**
- **Flask** — framework principal del servidor y definición de rutas (Blueprints).
- **Flask-SQLAlchemy** — ORM para el manejo de la base de datos.
- **Flask-JWT-Extended** — autenticación y manejo de tokens JWT.
- **Flask-CORS** — manejo de políticas de acceso entre frontend y backend.
- **Werkzeug** — hashing y verificación segura de contraseñas.
- **Google Gemini API (google-genai)** — generación de planes de entrenamiento y nutrición con IA.
- **smtplib / Gmail SMTP** — envío de correos de recuperación de contraseña.
- **Pipenv** — manejo de entorno virtual y dependencias.

### Base de datos

- **PostgreSQL**

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/4GeeksAcademy/TrainNote
cd TrainNote
```

### 2. Instalar dependencias del backend

```bash
pipenv install
pipenv install google-genai
```

### 3. Instalar dependencias del frontend

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npm install chart.js react-chartjs-2
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Backend
GEMINI_API_KEY=tu_clave
MAIL_USERNAME=tucorreo@gmail.com
MAIL_PASSWORD=tu_clave
JWT_SECRET_KEY=tu_clave

# Frontend
VITE_BASENAME=/
VITE_BACKEND_URL=https://tu-backend-url
BACKEND_URL=https://tu-backend-url
VITE_CLOUDINARY_CLOUD_NAME=tu_clave
```

> **Nota:** `MAIL_PASSWORD` debe ser una [contraseña de aplicación de Google](https://support.google.com/accounts/answer/185833), no la contraseña normal de la cuenta de Gmail.

## Ejecutar el proyecto

Backend:

```bash
pipenv run start
```

Frontend:

```bash
npm run start
```
## URL Render
https://sample-service-name-9edp.onrender.com/

# TRAIL 🏔️🚴‍♂️
**Plataforma social para ciclistas de montaña y gravel**

TRAIL es una aplicación web full stack orientada a ciclistas que quieren **registrar rutas**, **analizar recorridos**, **descubrir servicios cercanos** y **conectar con otros riders**, incorporando además **recomendaciones inteligentes mediante IA**.

---

##  Descripción
TRAIL permite a los usuarios:

- Registrar y guardar rutas GPS
- Visualizar rutas en mapas interactivos
- Consultar servicios cercanos a una ruta (hospitales, gasolineras, comida, talleres)
- Gestionar bicicletas y mantenimiento
- Interactuar con otros usuarios (actividad social)
- Recibir recomendaciones inteligentes de bicicletas y componentes según su uso

El proyecto está desarrollado como **aplicación full stack moderna**, con frontend en React y backend en Flask API.

---

##  Stack Tecnológico

### Frontend
- React + Vite
- Mapbox / MapLibre
- JavaScript (ES6+)
- CSS modular + Design System

### Backend
- Python
- Flask API
- SQLAlchemy
- JWT Authentication
- REST API

### IA
- Ollama
- Modelo Qwen 2.5
- Microservicio de recomendaciones

### Datos y Mapas
- OpenStreetMap
- Overpass API (servicios cercanos a rutas)

---

##  Funcionalidades Principales

-  Registro y visualización de rutas
-  Mapas interactivos con capas dinámicas
-  Servicios cercanos a la ruta (POIs)
-  Garage de bicicletas y mantenimiento
-  Actividad social entre usuarios
-  Recomendador inteligente de bicicletas y componentes
-  Autenticación y gestión de usuarios

---

##  Instalación Local

### Requisitos
- Python 3.10
- Node.js
- Pipenv
- Base de datos (PostgreSQL recomendado)

---

### Backend
```bash
pipenv install
cp .env.example .env
pipenv run migrate
pipenv run upgrade
pipenv run start
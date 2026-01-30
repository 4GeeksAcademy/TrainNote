# 🎨 Sistema de estilos del proyecto

Este proyecto usa un sistema de estilos simple para mantener
coherencia visual y evitar CSS desordenado.

---

## 📁 Estructura

styles/
├── design-system.css   → variables globales (colores, spacing, sombras)
├── ui.css              → componentes UI comunes (paneles, botones, inputs)
├── Pages/              → estilos de páginas (layout)
└── Components/         → estilos específicos de componentes

---

## 🧠 Reglas IMPORTANTES (léelas antes de tocar CSS)

### 1️⃣ Colores
❌ No usar colores directos (`#fff`, `#f2cc0c`, etc.)  
✅ Usar SIEMPRE variables de `design-system.css`

---

### 2️⃣ Paneles / Ventanas
Todo bloque grande (cards, secciones, ventanas) debe usar:

```html
<div class="ui-panel">...</div>

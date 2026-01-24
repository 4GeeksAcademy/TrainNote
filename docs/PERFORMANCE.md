# React Performance Guidelines / Guía de Rendimiento en React

## English

This project follows React performance principles inspired by
Vercel Engineering best practices (January 2026).

Focus order (by impact):
1. Eliminate async waterfalls
2. Reduce client bundle size
3. Prefer server-side work when possible
4. Parallelize independent async operations
5. Prevent unnecessary re-renders

These guidelines are enforced both manually and via AI-assisted code reviews
(GitHub Copilot with the vercel-react-best-practices skill).

---

## Español

Este proyecto sigue principios de rendimiento en React inspirados en
las mejores prácticas de ingeniería de Vercel (enero de 2026).

Orden de enfoque (según impacto):
1. Eliminar cascadas asíncronas (async waterfalls)
2. Reducir el tamaño del bundle del cliente
3. Priorizar trabajo en el servidor siempre que sea posible
4. Paralelizar operaciones asíncronas independientes
5. Evitar renderizados innecesarios

Estas directrices se aplican tanto de forma manual como mediante revisiones
de código asistidas por IA (GitHub Copilot con la skill vercel-react-best-practices).

# Portfolio de Alexander Farfán Navarro

Sitio de portafolio personal — sobre mí, skills, trabajos, proyectos, artículos y contacto. Bilingüe (inglés/español), con modo oscuro y CV descargable.

🔗 En vivo: https://loweffort-alt.github.io/portfolio-v4/ (temporal — ver [Dominio](#dominio) más abajo)

## Características

- **Bilingüe**: contenido en inglés (`/en`) y español (`/es`), con un botón para cambiar de idioma
- **Modo oscuro / claro**, recordado entre visitas
- **Secciones**: Sobre mí, Habilidades, Trabajos, Proyectos, Artículos, Contactos
- **CV descargable** en PDF, con su propia página de vista previa
- Sitio estático, rápido, sin backend

## Stack

- [Astro](https://astro.build) 7 — genera el sitio como HTML estático
- [React](https://react.dev) — solo para algún componente puntual interactivo
- [Tailwind CSS](https://tailwindcss.com) — estilos
- TypeScript

## Cómo correrlo en local

```bash
npm install
npm run dev
```

Abrir **http://localhost:4321/portfolio-v4/en** en el navegador (nota el `/portfolio-v4/` en la URL, ver [Dominio](#dominio)).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio de producción en `./dist/` |
| `npm run preview` | Sirve localmente el build de producción, para probarlo antes de publicar |
| `npm run lint` | Revisa el código con ESLint |
| `npm run format` | Revisa el formato del código con Prettier |
| `npm run astro -- check` | Chequeo de tipos de TypeScript |

## Cómo editar el contenido

Todo el contenido real (trabajos, proyectos, artículos, contactos) vive en archivos simples dentro de `src/data/`:

- `works.json.ts` — trabajos/empleos
- `projects.json.ts` — proyectos personales
- `articles.json.ts` — artículos escritos
- `contact.json.ts` — links de contacto

Cada uno exporta un array de objetos — para agregar o quitar un ítem, se agrega o quita un objeto del array correspondiente. No hace falta tocar ningún componente.

Los textos fijos de la interfaz (títulos de sección, etc.) están en `src/i18n/languages.json.ts`, con una versión en inglés y otra en español.

## Despliegue

El sitio se publica solo a GitHub Pages con cada `push` a `main` (workflow en `.github/workflows/deploy.yml`). Además, cada Pull Request corre lint y build automáticamente antes de poder mergear (`.github/workflows/ci.yml`).

### Dominio

Ahora mismo el sitio no tiene dominio propio conectado, así que vive en la URL por defecto de GitHub Pages, bajo la subruta `/portfolio-v4/`. Cuando se compre un dominio propio, hay que actualizar dos líneas en `astro.config.mjs`:

```js
site: 'https://tu-dominio.com',
base: '/', // o eliminar esta línea
```

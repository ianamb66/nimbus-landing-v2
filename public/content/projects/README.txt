# Projects content (Experiencia)

Edita los casos que aparecen en la sección **Experiencia**.

## Archivos
- projects.json  → Lista de proyectos (título, subtítulo y texto de la tarjeta/modal)
- Las imágenes (covers) van en /public/assets/fotos/ (o cualquier ruta dentro de /public)

## Cómo editar
1) Abre: public/content/projects/projects.json
2) Cambia:
   - title
   - subtitle
   - what (qué hicimos)
   - challenges (retos)
   - solutions (cómo lo solucionamos)
   - results (resultados)
   - cover (ruta de la imagen)
3) Guarda, haz commit y deploy.

## Formato
- challenges/solutions/results son listas de strings.
- cover es una ruta absoluta desde /public, ejemplo: "/assets/fotos/proyecto-1.png"

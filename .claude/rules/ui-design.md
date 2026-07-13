# Diseño de UI

Objetivo: interfaz minimalista y sobria, que parezca una herramienta cuidada, no
una plantilla generada por IA. Es un gestor de colección: prima la densidad de
contenido útil y la legibilidad sobre el efectismo.

## Prohibiciones (estética "IA")

- Sin degradados decorativos, especialmente violeta/azul y multicolor.
- Sin emojis en la interfaz ni como iconos.
- Sin glassmorphism, blur de fondo, ni sombras exageradas.
- Sin brillos, "glow", bordes neón ni animaciones llamativas.
- Sin ilustraciones genéricas de stock ni hero gigante vacío.
- Sin copys grandilocuentes ("Supercharge your collection"). Texto directo.

## Paleta y superficies

- Paleta neutra (grises) + **un** color de acento usado con moderación (enlaces,
  estado activo, acción primaria).
- Superficies planas diferenciadas por bordes sutiles o cambios ligeros de fondo,
  no por sombras pesadas.
- Colores con significado (verde/ámbar/rojo) solo para estado real de
  completitud o alertas de precio, no como decoración.

## Tipografía y espaciado

- Una fuente sans legible (system stack o similar). Un par de pesos, sin
  florituras.
- Escala de espaciado y de tamaños consistente (usar tokens de Tailwind, no
  valores arbitrarios sueltos).
- Jerarquía por tamaño y peso, no por color ni por cajas de colores.

## Patrones

- Colección **por consola**: cada plataforma como módulo/sección navegable.
- Estado de completitud mostrado de forma compacta y clara (los flags de
  `data-model.md`), legible de un vistazo en listados.
- Imágenes de portada a tamaño contenido y consistente; nunca deformadas.
- Estados vacíos con texto útil y una acción, sin ilustraciones decorativas.

## Componentes

- Componentes propios y pequeños, reutilizables. Sin arrastrar una librería de UI
  pesada.
- Accesibilidad básica: contraste suficiente, foco visible, controles navegables
  por teclado, textos alternativos en imágenes.
- La UI no contiene lógica de negocio ni llamadas externas (ver
  `architecture.md`).

# Guía paso a paso: `ProfileCard` con Atomic Design

Construcción de la tarjeta de identificación de RoboCop siguiendo el patrón **atómico (átomos → molécula)**, con estilos inline en un objeto local `Styles`.

> **Ubicación en el proyecto**
> - Átomos: `src/components/atoms/` — piezas visuales indivisibles y autónomas.
> - Molécula: `src/components/molecules/ProfileCard.jsx` — la composición.
> - Se consume en: `src/App.jsx` → `<section id="profile">`.

---

## 0. La filosofía atómica (por qué se hace así)

**Atomic Design** (Brad Frost) clasifica la interfaz de la pieza más pequeña a la composición más grande:

| Nivel    | Qué es                                                        | En este componente                                  |
|----------|---------------------------------------------------------------|-----------------------------------------------------|
| **Átomo**  | Pieza visual irreducible. No contiene otros componentes. Reutilizable en cualquier contexto. | `Emblem`, `Chip`, `PhotoFrame`, `Field`, `Barcode`, `Badge` |
| **Molécula** | Grupo de átomos que forma una unidad coherente. Depende de esos átomos. | `ProfileCard` |
| Organismo | Moléculas compuestas (p. ej. toda una página). —              | — |

**Reglas aplicadas**

1. **Los átomos nunca saben de la molécula.** Reciben props con valores por defecto y renderizan una unidad visual aislada. Se puede reemplazar `ProfileCard` y los átomos siguen funcionando.
2. **Cada capa posee sus propios estilos.** La identidad visual de cada átomo vive en su propio objeto `Styles` local. La molécula solo tiene estilos de *layout* (contenedores flex, paddings, fondo global de la tarjeta).
3. **Tema por variables CSS.** Átomos y molécula usan `var(--text)`, `var(--bg)`, `var(--accent)`, etc., definidas en `src/index.css`. La tarjeta se adapta sola a modo claro/oscuro sin tocar los componentes.
4. **Estilos = `style={Styles.x}`** (sin archivos CSS, sin librería CSS-in-JS, sin dependencias). El patrón de spread `{ ...Styles.x, ...style }` permite que quien consume el átomo lo sobreescriba.

**Resultado:** los 6 átomos se pueden reutilizar en otras tarjetas, formularios o pies de página, mientras `ProfileCard` solo tiene que ensamblarlos.

---

## 1. Estructura base

```
src/
├── assets/
│   └── RoboMurph1987.webp      # 768×1024 (3:4), importado en la molécula
├── components/
│   ├── atoms/
│   │   ├── Emblem.jsx
│   │   ├── Chip.jsx
│   │   ├── PhotoFrame.jsx
│   │   ├── Field.jsx
│   │   ├── Barcode.jsx
│   │   └── Badge.jsx
│   └── molecules/
│       └── ProfileCard.jsx
└── App.jsx                     # <section id="profile"><h2>…</h2><ProfileCard/></section>
```

> Nota: el asset se importa **directamente en la molécula** (`import roboImg from '../../assets/RoboMurph1987.webp'`) porque es dato propio de RoboCop. El átomo `PhotoFrame` solo recibe `src` como prop — un átomo no tiene contenido fijo.

---

## 2. Los átomos (uno por uno)

### 2.1 `Emblem.jsx` — el sello de la institución

**Propósito:** disco circular "sello" en la cabecera. Es decorativo → `aria-hidden="true"`.

```jsx
const Styles = {
  emblem: {
    flex: 'none',
    borderRadius: '50%',
    background:
      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0) 55%), linear-gradient(180deg, #4a5e7a, #1a2a44)',
    border: '1px solid rgba(255,255,255,0.25)',
    boxShadow:
      '0 0 0 2px rgba(255,255,255,0.08) inset, 0 1px 0 rgba(255,255,255,0.35) inset',
  },
}

function Emblem({ size = 26, style }) {
  return (
    <span
      aria-hidden="true"
      style={{ ...Styles.emblem, width: size, height: size, ...style }}
    />
  )
}
```

**Estilo por estilo:**

| Propiedad | ¿Por qué? |
|---|---|
| `borderRadius: '50%'` | Círculo. Junto con `width = height` genera un disco. |
| `background` (radial + linear) | Dos gradientes superpuestos: el *radial* arriba-izquierda simula el brillo de un sello en relieve; el *linear* de `#4a5e7a` a `#1a2a44` da la base azul marino metálica (azul policial + acero). |
| `border: 1px solid rgba(255,255,255,0.25)` | Borde fino claro que "separa" el disco de su fondo y le da aspecto de moneda. |
| `boxShadow` (dos `inset`) | El `inset` oscuro (2 px) simula el bisel interno del sello; el `inset` blanco superior refuerza la luz. |
| `flex: 'none'` | No estira ni se comprime con los vecinos del header. |
| Prop `size` + spread | Reutilizable: 26 px aquí, 32 px en otro header, sin duplicar estilos. |

---

### 2.2 `Chip.jsx` — etiqueta técnica con variantes

**Propósito:** etiqueta corta con borde. Se necesita en dos contextos: sobre fondo oscuro (header) y sobre fondo claro (footer). En vez de dos componentes, **un componente con prop `variant`**.

```jsx
const base = {
  flex: 'none',
  padding: '3px 8px',
  fontFamily: 'var(--mono)',
  fontSize: 10,
  letterSpacing: '0.18em',
  borderRadius: 3,
}

const variants = {
  inverse: {
    color: 'rgba(255,255,255,0.85)',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.25)',
  },
  accent: {
    fontSize: 9.5,
    letterSpacing: '0.2em',
    fontWeight: 700,
    color: 'var(--accent)',
    background: 'var(--accent-bg)',
    border: '1px solid var(--accent-border)',
  },
}
```

**¿Por qué?**

| Decisión | Razón |
|---|---|
| `base` separado de `variants` | La identidad estructural (fuente mono, tamaño chico, tracking amplio, borde 3 px) es común a ambos contextos. `inverse`/`accent` solo definen el *color* en cada contexto. |
| `fontFamily: 'var(--mono)'` | La tipografía mono es el código tipográfico de "datos técnicos" (códigos de documento, matrículas). La distingue de `--heading`. |
| `letterSpacing: '0.18em'` | Tracking amplio imita el sello/tampón de documentos oficiales. |
| **`inverse`** con blancos semi-transparentes | Se lee sobre cualquier fondo oscuro (en este caso, el header navy) sin hardcodear el color del header. |
| **`accent`** con las variables del tema `--accent`, `--accent-bg`, `--accent-border` | El sello "AUTHORIZED" destaca pero se adapta solo a claro/oscuro (en `index.css`, `--accent` es `#aa3bff` en claro y `#c084fc` en oscuro). |
| Spread `{ ...base, ...variants[variant], ...style }` | Cascada con prioridad: base → variante → override externo. El consumidor ajusta lo que necesite sin redefinir el resto. |

---

### 2.3 `PhotoFrame.jsx` — la foto enmarcada

**Propósito:** retrato oficial de la cédula, con marco y relieve.

```jsx
const Styles = {
  photo: {
    flex: 'none',
    objectFit: 'cover',
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.08))',
    boxShadow:
      '0 0 0 2px rgba(255,255,255,0.4) inset, 0 2px 4px rgba(0,0,0,0.12)',
  },
}

function PhotoFrame({ src, alt = '', width = 118, height = 154, style }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ ...Styles.photo, width, height, ...style }}
    />
  )
}
```

**¿Por qué?**

| Propiedad | Razón |
|---|---|
| `objectFit: 'cover'` | El asset es 3:4 (768×1024), proporción exacta de este marco, pero con `cover` + props `width/height` la foto sirve para **cualquier** marco sin deformarse (también una 1:1). |
| `border` + `borderRadius: 6` | Marco tipo foto de cédula: línea fina y esquina ligeramente redondeada (suaviza sin hacerlo "red social"). |
| `background` (gradiente negro 3%→8%) | Fondo de respaldo por si la imagen no cubre o carga tarde: se lee "vacío", no blanco (que rompería el marco en dark mode). |
| `boxShadow ... inset` (blanco, 2 px) | Borde interior blanco: simula la franja blanca tipo foto pegada a la cédula. |
| `boxShadow 0 2px 4px` | Sombra proyectada: la foto "flota" sobre la superficie de la tarjeta. |
| `width/height` como props **y** atributos | Los atributos evitan el salto de layout antes de que cargue la imagen; el estilo garantiza el tamaño final. |

---

### 2.4 `Field.jsx` — un par de datos (etiqueta + valor)

**Propósito:** una fila de dato de la cédula. Es la unidad más repetida: la molécula recibe un array de `{ label, value }` y lo mapea a `Field`.

```jsx
const Styles = {
  row: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    padding: '4px 0',
  },
  label: {
    flex: '1 1 auto',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text)',
    opacity: 0.8,
  },
  value: {
    flex: '1 1 auto',
    margin: 0,
    fontFamily: 'var(--heading)',
    fontSize: 12.5,
    fontWeight: 600,
    textAlign: 'right',
    color: 'var(--text-h)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}

function Field({ label, value, style }) {
  return (
    <div style={{ ...Styles.row, ...style }}>
      <dt style={Styles.label}>{label}</dt>
      <dd style={Styles.value}>{value}</dd>
    </div>
  )
}
```

**¿Por qué?**

| Propiedad | Razón |
|---|---|
| `dt`/`dd` (HTML semántico) | Dentro del `dl` de la molécula forman una lista de definición real: los lectores de pantalla anuncian "etiqueta, valor". Con `div/span` el par no tendría semántica. |
| `alignItems: 'baseline'` | Alinea la línea base del texto (no el centro): etiqueta y valor se leen en la misma línea aunque tengan tamaños distintos — terminación tipográfica profesional. |
| `justifyContent: 'space-between'` + `flex: '1 1 auto'` | Etiqueta empujada a la izquierda, valor a la derecha; los `1 1 auto` garantizan los dos compartimentos. |
| `gap: 12` + `padding: '4px 0'` | Respiración horizontal y vertical; las filas no se tocan (el separador lo pongo el contenedor de la molécula). |
| **Etiqueta** en mayúsculas chicas, `opacity: 0.8` | Jerarquía clásica de formulario: la etiqueta es secundaria (pequeña, espaciada, atenuada) y el valor es primario. |
| **Valor** con `fontWeight: 600` y `var(--text-h)` (máximo contraste) | Es la información a leer (nombre, año): el protagonista visual de la fila. `var(--text-h)` se adapta: `#08060d` en claro / `#f3f4f6` en oscuro. |
| `overflow: hidden; textOverflow: ellipsis; whiteSpace: nowrap` | **Robustez:** un valor largo (p. ej. "Detroit, Michigan") no parte el layout: se trunca con `…` y la tarjeta conserva su ancho. |

---

### 2.5 `Barcode.jsx` — código de barras decorativo

**Propósito:** barra de código falsa generada **sin imagen**, con gradiente. 100 % escalable, cero assets.

```jsx
const Styles = {
  barcode: {
    flex: '1 1 auto',
    background:
      'repeating-linear-gradient(90deg, var(--text-h) 0 1px, transparent 1px 3px, var(--text-h) 3px 4px, transparent 4px 7px, var(--text-h) 7px 9px, transparent 9px 10px, var(--text-h) 10px 11px, transparent 11px 13px)',
    opacity: 0.85,
  },
}

function Barcode({ height = 22, maxWidth = 160, style }) {
  return (
    <span
      aria-hidden="true"
      style={{ ...Styles.barcode, height, maxWidth, ...style }}
    />
  )
}
```

**¿Por qué?**

| Decisión | Razón |
|---|---|
| `repeating-linear-gradient(90deg, …)` | Un gradiente lineal **repetido en X con stops de distinto grosor** (1 px, 1 px, hueco 3 px…) genera barras verticales de grosores variados: reproduce un código de barras realista sin imagen. |
| El color es `var(--text-h)` | En modo claro son barras oscuras; en modo oscuro, claras. Sin escribir una sola línea extra. |
| `aria-hidden="true"` | Es puramente decorativo: no debe leerlo ningún lector de pantalla. |
| `flex: 1 1 auto` + `maxWidth: 160` | Ocupa el espacio libre del footer (entre el código y la placa) sin desbordar. |
| `opacity: 0.85` | Apaga el contraste: se lee "impreso", no "pintado". |
| Props `height`/`maxWidth` | El mismo átomo sirve en cualquier footer, a cualquier tamaño. |

---

### 2.6 `Badge.jsx` — la placa de identificación

**Propósito:** el número de badge (`#6042`), con clave `Badge` acentuada y número destacado.

```jsx
const Styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 6,
    padding: '4px 10px',
    fontFamily: 'var(--mono)',
    fontSize: 12,
    color: 'var(--text-h)',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 4,
  },
  key: {
    fontSize: 9,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    fontWeight: 700,
  },
  num: {
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
}

function Badge({ prefix = 'Badge', value, style }) {
  return (
    <span style={{ ...Styles.badge, ...style }}>
      <span style={Styles.key}>{prefix}</span>
      <span style={Styles.num}>{value}</span>
    </span>
  )
}
```

**¿Por qué?**

| Propiedad | Razón |
|---|---|
| `background: var(--bg)` + `border: 1px solid var(--border)` | En el footer (que tiene fondo con textura) la placa "flota" como etiqueta pegada, usando el fondo propio de la tarjeta y su borde. |
| `fontFamily: 'var(--mono)'` | Números en mono: todos los dígitos igual de anchos, fáciles de leer y alinear (una placa es dato, no texto). |
| **Clave** en `var(--accent)` + mayúsculas | La palabra "Badge" es un indicador secundario: color de acento + tracking amplio la distinguen del dato. |
| **Número** con `700` + `letterSpacing: 0.04em` | El dato es el protagonista: la tinta más gruesa de toda la placa. |
| Prop `prefix` | Si mañana otra tarjeta pide "Placa #1234", el mismo átomo sirve con un solo prop. |

---

## 3. La molécula: `ProfileCard.jsx`

### 3.1 Qué vive aquí (y qué no)

**Solo tres responsabilidades** (así lo dicta Atomic Design):

1. **Datos:** los defaults de RoboCop (nombre, rol, badge, emisor, imagen, fields).
2. **Composición:** disponer los átomos en la estructura de una cédula (cabeza → cuerpo → pie).
3. **Layout:** el flex global de la tarjeta y de sus secciones — *nunca* la identidad visual de las piezas internas (eso es de los átomos).

**No está aquí:** sello, marco de foto, fila de datos, barcode, placa, chips — todo son átomos externos.

### 3.2 Datos por defecto, sobreescribibles por props

```jsx
const DEFAULT_NAME = 'RoboCop'
const DEFAULT_ROLE = 'Oficial de la policía cibernética'
const DEFAULT_BADGE = '6042'
const DEFAULT_ISSUER = 'Detroit Police Department'
const DEFAULT_DOC = 'OFFICER IDENTITY CARD'
const DEFAULT_IMAGE = roboImg
const DEFAULT_ALT = 'RoboCop, unidad policial robótica CPD de Detroit'
const DEFAULT_DETAILS = [
  { label: 'Identidad', value: 'Alex J. Murphy' },
  { label: 'Año', value: '1987' },
]
```

**¿Por qué?** La molécula es **reutilizable**: `<ProfileCard />` muestra a RoboCop por defecto, pero `<ProfileCard name="Caleb" image={…} details={[…]} />` muestra a otro personaje sin tocar el código. Los datos de RoboCop son el *default*, no una constante.

### 3.3 Estructura JSX

```jsx
return (
  <div style={Styles.mainContainer}>
    <article style={Styles.card} aria-label={`Identificación de ${name}`}>
      {/* ── CABEZA: institución + documento ── */}
      <header style={Styles.header}>
        <Emblem />
        <span style={Styles.issuer}>{issuer}</span>
        <Chip variant="inverse" aria-hidden="true">{doc}</Chip>
      </header>

      {/* ── CUERPO: foto + datos ── */}
      <div style={Styles.body}>
        <PhotoFrame src={image} alt={alt} />
        <div style={Styles.info}>
          <h3 style={Styles.name}>{name}</h3>
          <p style={Styles.role}>{role}</p>
          <dl style={Styles.fields}>
            {details.map(({ label, value }) => (
              <Field key={label} label={label} value={value} />
            ))}
          </dl>
        </div>
      </div>

      {/* ── PIE: seguridad ── */}
      <footer style={Styles.footer}>
        <Barcode />
        <Badge value={`#${badge}`} />
        <Chip variant="accent" aria-hidden="true">
          AUTHORIZED
        </Chip>
      </footer>
    </article>
  </div>
)
```

**¿Por qué este orden (arriba → abajo)?** Replica el flujo de información de una cédula real: *quién emite → quién es → cómo se verifica*. Las etiquetas semánticas (`article/header/footer/dl/h3`) le dan estructura a los lectores de pantalla; `aria-label` anuncia "Identificación de RoboCop".

**Detalles a notar:**
- `aria-hidden="true"` en los chips decorativos (`doc`, `AUTHORIZED`): no aportan información legible.
- El `alt` sí existe en la foto: es la única imagen con contenido semántico.
- **El `dl` está en la molécula y los `dt/dd` en el átomo `Field`**: el contenedor semántico pertenece a la estructura (molécula), la identidad de la fila pertenece al átomo.

### 3.4 `Styles` de la molécula: solo layout

```jsx
const Styles = {
  mainContainer: {
    marginTop: 32,
    marginBottom: 32,        // respiración dentro de la página
  },
  card: {
    display: 'flex',
    flexDirection: 'column',  // cabeza → cuerpo → pie, en vertical
    width: '100%',
    maxWidth: 420,            // ancho de cédula real (~3.5")
    margin: '16px auto 0',    // centrada en la página
    boxSizing: 'border-box',  // el borde no rompe los 420 px
    textAlign: 'left',        // (la página por defecto está centrada)
    overflow: 'hidden',       // nada se salga de las esquinas redondeadas
    color: 'var(--text)',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    boxShadow:
      '0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, var(--shadow)',
    backgroundImage:
      'repeating-linear-gradient(-45deg, transparent 0 6px, rgba(127,127,127,0.035) 6px 7px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    color: '#fff',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 55%, rgba(0,0,0,0.15)), linear-gradient(180deg, #0f1e3a, #0a1526)',
    borderBottom: '1px solid var(--border)',
  },
  issuer: {
    flex: '1 1 auto',
    fontFamily: 'var(--heading)',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  body: {
    display: 'flex',    // foto (izquierda) + datos (derecha)
    gap: 16,
    padding: 16,
  },
  info: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,        // permite el ellipsis de Field (ver debajo)
  },
  name: {
    margin: 0,
    fontFamily: 'var(--heading)',
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
    color: 'var(--text-h)',
  },
  role: {
    margin: 0,
    fontSize: 12.5,
    fontWeight: 500,
    color: 'var(--accent)',   // acento = jerarquía secundaria
  },
  fields: {
    margin: '6px 0 0',
    padding: '8px 0 0',
    borderTop: '1px dashed var(--border)',  // divisor "de sección", no muro
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderTop: '1px solid var(--border)',
    background:
      'repeating-linear-gradient(90deg, transparent 0 3px, rgba(127,127,127,0.05) 3px 5px), var(--code-bg)',
  },
}
```

**Estilo por estilo (los "porqués" de la tarjeta):**

| Regla | ¿Por qué? |
|---|---|
| `card.maxWidth: 420` + `margin: auto` | La cédula es un objeto de formato rígido: no se estira a lo ancho de la pantalla, queda centrada. |
| `card.boxShadow` (dos `inset`) | Borde 3D sutil arriba/abajo, como luz cayendo sobre la cara del papel. |
| `card.backgroundImage` (diagonales al 3.5 % de opacidad) | **Textura de seguridad tipo billete/documento oficial**: casi imperceptible, pero la diferencia de una caja blanca simple. |
| `header.background` (dos gradientes) | Base azul navy (`#0f1e3a → #0a1526`) + luz blanca en la parte superior: se lee "institución oficial" y separa la cabeza del cuerpo. |
| `header.color: '#fff'` + `borderBottom` | Blanco sobre navy = alto contraste; el borde "corta" la franja. |
| `issuer` en mayúsculas con tracking | Nombre institucional: formal, estampado, con aire entre letras. |
| `body` flex horizontal | En toda cédula la foto está **al costado**, no encima del nombre: es la convención de los documentos oficiales. |
| `info.minWidth: 0` | **Clave:** es el que permite que el `text-overflow: ellipsis` de `Field` funcione dentro de flex. Sin esto, el hijo flex se niega a encoger y el texto largo desborda la tarjeta. |
| `name` 24 px / 700 | El nombre es lo primero que se lee: la tipografía más grande de la tarjeta. |
| `role` en `var(--accent)` | Jerarquía de segundo nivel, con color de acento para no competir con el nombre. |
| `fields.borderTop: 1px dashed` | Separador "de sección" (traceado = ligero, no compite con los bordes sólidos de la tarjeta). |
| `footer.background` (barras verticales + `--code-bg`) | Franja visualmente distinta al resto: es la zona de "elementos de seguridad" (código, placa, sello). |

### 3.5 Consumo en la app

```jsx
// App.jsx
<section id="profile">
  <h2>Perfil del agente</h2>
  <ProfileCard />
</section>
```

---

## 4. Cómo replicarlo (paso a paso)

1. **Define la estructura del objetivo** (una cédula tiene: cabeza, foto, campos, pie).
2. **Extrae las piezas visuales** que tengan sentido propio → átomos (`Emblem`, `PhotoFrame`, `Field`, `Chip`, `Barcode`, `Badge`).
3. **Escribe primero cada átomo** (con sus `Styles` y props con defaults), sin depender de nada externo.
4. **Escribe la molécula al final**: datos, imports, composición y solo estilos de layout.
5. **Valida con las puertas de calidad del proyecto:** `npm run lint` + `npm run build`.
6. **Verifica el tema:** cambia el modo claro/oscuro del sistema y comprueba que todas las `var(--…)` se adaptan sin tocar el componente.

## 5. Trade-offs conocidos

| Decisión | Beneficio | Costo |
|---|---|---|
| `Styles` inline | Cero dependencias; estilos locales al componente; overridables con spread | Sin media queries, sin pseudo-classes (`:hover`), sin `@media (prefers-color-scheme)` a nivel CSS |
| Variables CSS | Tema claro/oscuro gratis en todo el árbol | Requiere que las variables existan en `index.css` |
| Átomos como componentes locales (no paquete) | Cero instalación; fáciles de mover | No se importan fuera de este proyecto |

Para recuperar **media queries** o **hover**, el camino es: mover esos estilos a un `ProfileCard.module.css` (CSS Modules, soportado por Vite sin config) o usar un hook `useMediaQuery`.

## 6. Hacia dónde puede ir

- `organisms/` → la sección "Agente" completa (tarjeta + botón "Ver historial").
- Un átomo nuevo `StatusPill` para el estado de la cuenta.
- Variante `danger` del `Chip` para estados "REVOCADA".
- Un hook `useIdentityCard()` que centralice los defaults para tests.

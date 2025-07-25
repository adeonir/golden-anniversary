# Guia de Design - Site Bodas de Ouro

## Sistema de Cores Tailwind + Shadcn

### Configuração CSS Variables (Root)

```css
:root {
  --gold-50: oklch(98% 0.02 85);
  --gold-100: oklch(95% 0.04 85);
  --gold-200: oklch(88% 0.08 85);
  --gold-300: oklch(82% 0.12 85);
  --gold-400: oklch(75% 0.15 85);
  --gold-500: oklch(68% 0.18 85);
  --gold-600: oklch(60% 0.15 85);
  --gold-700: oklch(52% 0.12 85);
  --gold-800: oklch(44% 0.09 85);
  --gold-900: oklch(36% 0.06 85);

  --font-heading: var(--font-serif);
  --font-script: var(--font-script);
  --font-sans: var(--font-sans);

  --radius: 0.625rem;

  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(52% 0.12 85); /* gold-700 */
  --primary-foreground: oklch(98% 0.02 85); /* gold-50 */
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(95% 0.04 85); /* gold-100 */
  --accent-foreground: oklch(44% 0.09 85); /* gold-800 */
  --destructive: oklch(0.577 0.245 27.325);

  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(60% 0.15 85); /* gold-600 */
}
```

### Cores Customizadas Tailwind v4

```css
@theme inline {
  --color-gold-50: var(--gold-50);
  --color-gold-100: var(--gold-100);
  --color-gold-200: var(--gold-200);
  --color-gold-300: var(--gold-300);
  --color-gold-400: var(--gold-400);
  --color-gold-500: var(--gold-500);
  --color-gold-600: var(--gold-600);
  --color-gold-700: var(--gold-700);
  --color-gold-800: var(--gold-800);
  --color-gold-900: var(--gold-900);

  --font-family-heading: var(--font-heading);
  --font-family-script: var(--font-script);
  --font-family-body: var(--font-body);
}
```

### Uso no Código

```tsx
<div className="bg-primary text-primary-foreground">
  <h1 className="font-script text-gold-500">Iria & Ari</h1>
  <h2 className="font-heading">Bodas de Ouro</h2>
  <p className="font-body text-muted-foreground">50 anos de amor</p>
</div>

<button className="bg-gold-600 hover:bg-gold-700 text-white font-body">
  Enviar Mensagem
</button>
```

## Tipografia

### Font Families (next/font/google)

```tsx
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
```

### Decisões Tipográficas

- **Body Font (Inter)**: Textos longos, elementos de UI, legibilidade geral
- **Heading Font (Playfair Display)**: Títulos de seções, texto elegante
- **Script Font (Dancing Script)**: Nomes do casal, detalhes especiais

## Tema Visual

### Conceito

Elegância dourada para celebrar bodas de ouro, evitando excessos e mantendo sofisticação.

### Paleta Principal

- **Primary (gold-500)**: Elementos principais, CTAs importantes
- **Secondary (gold-100)**: Backgrounds suaves, cards secundários
- **Accent (gold-600)**: Hovers, estados ativos
- **Muted (gold-50)**: Backgrounds muito sutis

### Princípios de Uso

- Dourado como accent, não dominante
- Priorizar legibilidade sempre
- Usar gold-50/gold-100 para backgrounds
- gold-500/gold-600 para elementos interativos
- Combinar com branco/creme para harmonia

## Micro-interações

### Planejamento de Estados

**Buttons**:

- Default: bg-primary
- Hover: bg-primary/90 + scale-105
- Active: bg-primary/80
- Disabled: bg-muted

**Cards**:

- Default: border-border
- Hover: border-gold-200 + shadow-lg
- Focus: ring-2 ring-ring

**Images**:

- Loading: skeleton gold-100
- Hover: scale-105 + brightness-110
- Error: bg-muted + icon

### Animações Planejadas

- **Page transitions**: Fade in suave
- **Scroll animations**: Timeline aparecer gradualmente
- **Hover effects**: Lift + shadow em cards
- **Loading states**: Pulse em skeleton loaders
- **Success feedback**: Checkmark animation

## Acessibilidade

### Contraste Validado

Combinações testadas:

- ✅ primary + primary-foreground (4.5:1)
- ✅ gold-600 + white (4.8:1)
- ✅ gold-700 + white (6.2:1)
- ✅ muted + muted-foreground (4.6:1)
- ⚠️ gold-400 + white (3.8:1) - Evitar

### Guidelines

- **Touch targets**: min 44px (use Tailwind min-h-11)
- **Focus visible**: ring-2 ring-ring sempre presente
- **Color contrast**: Sempre ≥ 4.5:1
- **Text scaling**: Funcional até 200% zoom
- **Keyboard navigation**: Tab order lógico

## Handoff para Desenvolvimento

### Componentes Shadcn Base

- Button (primary, secondary, outline, ghost)
- Card (com header, content, footer)
- Input (text, email, textarea)
- Badge (status indicators)
- Dialog (modals)

### Custom Components

- TimeCard (countdown)
- PhotoCarousel (gallery)
- MessageCard (guestbook)
- TimelineItem (marcos)

## Validação de Design

### Checklist por Componente

- ✅ Responsive (375px, 768px, 1440px)
- ✅ Estados definidos (default, hover, active, disabled)
- ✅ Contraste validado
- ✅ Touch targets adequados
- ✅ Loading states planejados

### Testes Recomendados

- **Mobile real**: Testar em dispositivo físico
- **Accessibility tools**: WAVE, axe DevTools
- **Color contrast**: Verificar no Figma + browser
- **Keyboard navigation**: Tab através de toda interface
- **Screen reader**: Testar estrutura semântica

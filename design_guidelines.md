# Design Guidelines: Fashion Designer PWA

## Design Approach
**System-Based: Material Design Principles** adapted for creative professionals
- Justification: Mobile-first utility app requiring complex touch interactions, clear hierarchy, and consistent component behavior across diverse input types
- Emphasis on tactile surfaces, responsive touch feedback, and information density optimization for small screens

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - modern, highly legible at small sizes
- **Accent Font**: Outfit (Google Fonts) - for headings and onboarding
- **Scale**:
  - Mobile body: text-sm (14px), headings: text-lg to text-2xl
  - Tablet+: text-base (16px), headings: text-xl to text-4xl
- **Weights**: Regular (400) for body, Medium (500) for labels, SemiBold (600) for headings, Bold (700) for CTAs

### Layout System
**Tailwind Spacing**: Use units of 2, 4, 6, and 8 consistently
- Mobile padding: p-4, section gaps: space-y-6
- Tablet+: p-6 to p-8, section gaps: space-y-8
- Card/panel internal spacing: p-4
- Touch target minimum: h-12 w-12 (48px)

### Component Library

**Navigation**
- Bottom navigation bar (fixed) with 4-5 primary actions: Templates, Customize, Palettes, Export, Settings
- Icons from Heroicons (CDN) - outline style for inactive, solid for active states
- Each nav item: icon + label, tap area 56x56px minimum

**Canvas Workspace**
- Full-screen canvas area with floating control panels
- Pinch-zoom enabled region with visible zoom level indicator (e.g., "85%")
- Draggable garment preview centered with subtle grid overlay
- Touch handles on garment corners for rotate/resize (12px diameter circles)

**Control Panels**
- Collapsible bottom sheet (Material Design pattern) for main controls
- Drag handle at top (w-12 h-1 rounded pill shape)
- Sections with expansion chevrons: Measurements, Style, Color, Texture
- Each section expands accordion-style with smooth 200ms transitions

**Input Components**
- Measurement inputs: Large numeric fields (h-14) with unit toggle (metric/imperial) as segmented control
- Sliders: Fat touch-friendly track (h-2), thumb size 20px, step indicators below
- Color picker: Large circular swatch (64px) opening full-screen picker modal
- Texture selector: Grid of 80x80px preview squares with 4px gaps
- Toggle switches: Material Design style, 48x28px with clear on/off states

**Garment Templates**
- Horizontal scrollable card carousel (snap-scroll)
- Each template card: 160x200px with garment silhouette illustration, name below
- Active template has subtle elevated appearance (shadow-md)

**Size Grading Panel**
- Horizontal size chips (S, M, L, XL, XXL) with active state
- Below chips: increment adjustment slider (-4cm to +4cm range)
- Live preview of measurements per size in expandable table

**Palettes & Swatches**
- Saved palettes as horizontal scrollable rows
- Each palette: 5 circular color swatches (32px) in a row
- Add/delete/export icons at row end (24px)
- Import palette button: dashed border card prompting JSON upload

**Onboarding Tutorial**
- Full-screen overlay with hand gesture animations
- 4-5 screens: Welcome, Touch Controls, Measurements, Customization, Save
- Skip button (top-right), Next/Done button (bottom, full-width)
- Progress dots at bottom

**Buttons & CTAs**
- Primary actions: Rounded-lg, h-12, font-medium, full-width on mobile
- Secondary actions: Outlined variant with border-2
- Icon buttons: Square 48x48px with centered icon
- FAB (Floating Action Button): 56x56px circle, fixed bottom-right with m-4, for quick "Save Design"

**Forms**
- Labels above inputs, text-sm font-medium
- Input fields: rounded-md, h-12, border-2, focus ring treatment
- Validation messages below field, text-xs
- Helper text in muted style

**Modals & Sheets**
- Full-screen modals for complex inputs (texture upload, palette editor)
- Close button: top-left X icon, 44x44px tap target
- Bottom sheets slide up from bottom with backdrop overlay

**Texture Upload**
- Drag-drop zone: Dashed border, rounded-lg, min-h-48
- Preview thumbnails in 3-column grid below
- Controls for scale/rotation/opacity as slider row below preview

**Export Panel**
- Preview of current design (200px height)
- Export format options as segmented control (PNG, SVG, JSON)
- Download button: Primary style, full-width
- Share button (if Web Share API available)

### Animations
**Minimal, purposeful only:**
- Bottom sheet slide-up: 250ms ease-out
- Accordion expansions: 200ms ease
- Button press feedback: scale(0.95) on active state, 100ms
- No scroll animations, parallax, or decorative motion

### Images
**No hero images** - This is a utility app, not marketing
- Garment template silhouettes: Simple line art SVGs (use placeholder comments for custom garment illustrations)
- Texture previews: Use pattern fills (e.g., denim weave, silk shimmer) as CSS backgrounds initially
- Onboarding: Hand gesture illustrations from icon library or simple SVG animations

### Mobile-First Optimizations
- Bottom navigation vs top nav for thumb reach
- Large, well-spaced touch targets (minimum 44x44px)
- Sticky headers on scroll for context retention
- Collapsible sections to maximize canvas space
- Horizontal scrolling for template/palette selection (faster than vertical on mobile)
- Single-column layouts, multi-column only on tablet+ (md: breakpoint)

### PWA Specific
- Install prompt: Subtle banner at top with "Add to Home Screen" CTA
- Offline indicator: Toast notification when connection lost
- Loading states: Skeleton screens for IndexedDB data retrieval
- App shell: Persistent bottom nav and header, content area swaps
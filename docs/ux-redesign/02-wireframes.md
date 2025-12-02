# QuickProSite - Wireframe Documentation

**Purpose**: Low-fidelity layouts for rapid iteration and developer alignment.
**Format**: ASCII art + annotated descriptions.
**View**: Best viewed in monospace font (Markdown preview or code editor).

---

## 📐 WIREFRAME 1: Landing/Onboarding Page

```
┌────────────────────────────────────────────────────────────────┐
│                                    [Login to Dashboard →]  (1) │
│                                                                │
│                                                                │
│                                                                │
│                 ╔═══════════════════════════╗                 │
│                 ║   YOUR SITE. BUILT BY AI  ║  (2)           │
│                 ║   [gradient text]         ║                 │
│                 ╚═══════════════════════════╝                 │
│                                                                │
│            Zero code. Zero effort. Ready in 30 seconds.  (3)  │
│                                                                │
│                                                                │
│    ┌──────────────────────────────────────────────────┐      │
│    │ [Glassmorphic Card]                              │      │
│    │                                                   │      │
│    │  Find Your Business on Google                    │  (4) │
│    │  ┌─────────────────────────────────────────┐    │      │
│    │  │ 🔍 Search for your business...          │    │      │
│    │  └─────────────────────────────────────────┘    │      │
│    │                                                   │      │
│    │  ┌─────────────────────────────────────────┐    │      │
│    │  │ ✓ Found: Joe's Plumbing                 │ (5)│      │
│    │  │ ⭐⭐⭐⭐⭐ (247 reviews)                  │      │
│    │  └─────────────────────────────────────────┘    │      │
│    │                                                   │      │
│    │  ─────────────── OR ───────────────             │  (6) │
│    │                                                   │      │
│    │  I'm a [Plumber ▼] in [Austin, TX_____]    (7) │      │
│    │  [inline dropdown]  [inline input]              │      │
│    │                                                   │      │
│    │  ┌─────────────────────────────────────────┐    │      │
│    │  │     Generate My Site ✨                  │ (8)│      │
│    │  │     [gradient button, full width]        │    │      │
│    │  └─────────────────────────────────────────┘    │      │
│    └──────────────────────────────────────────────────┘      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Annotations:

**(1) Login Link**
- Position: `absolute top-6 right-6`
- Style: Ghost link, small text
- Hover: Color shift slate-400 → cyan-400

**(2) Hero Headline**
- Size: 72px (text-7xl)
- Font: Geist Sans Bold
- Effect: Gradient text (cyan → purple → pink)
- Shadow: Subtle glow

**(3) Subheadline**
- Size: 20px (text-xl)
- Color: Slate-400
- Position: Directly below headline, mb-12

**(4) Google Search Input**
- Feature: Autocomplete dropdown (off-screen in wireframe)
- State: Default → Focused (glow) → Success (green box below)
- Icon: Magnifying glass (left side)

**(5) Success State**
- Visibility: Only shows after selection
- Background: Emerald tint (dark mode friendly)
- Content: Business name + rating stars

**(6) Divider**
- Style: Horizontal rule with centered text
- Color: Slate-700 line, Slate-500 text

**(7) Mad Libs Input**
- Layout: INLINE (not stacked)
- Example: "I'm a [dropdown] in [input]"
- Font size: Large (text-2xl) for readability
- Focus state: Underline glow

**(8) CTA Button**
- Width: Full (w-full)
- Height: 64px (py-4)
- Gradient: Cyan → Purple
- Shadow: Purple glow
- Hover: Scale 105%

### Interaction Flow:
1. User lands → sees headline + card
2. Option A: Search Google → autocomplete → prefill form
3. Option B: Manual entry → dropdown + text input
4. Click "Generate" → Transition to Loading Screen

---

## ⚡ WIREFRAME 2: Loading/Generation State

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                       QuickProSite                        (1) │
│                       [small logo]                            │
│                                                                │
│                                                                │
│                          ╔═══╗                                │
│                          ║ ✨ ║                          (2) │
│                          ╚═══╝                                │
│                    [animated pulse]                           │
│                                                                │
│                                                                │
│              ✓  Analyzing your industry              (3a)    │
│              ⏳ Writing your copy                    (3b)    │
│              ⏳ Designing your layout                (3c)    │
│              ⏳ Selecting images                     (3d)    │
│              ⏳ Launching your site                  (3e)    │
│                                                                │
│                                                                │
│                                                                │
│                                                                │
│   ┌──────────────────────────────────────────────────┐       │
│   │▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  (4)   │
│   └──────────────────────────────────────────────────┘       │
│           Building your site... ~10 seconds remaining    (5) │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Annotations:

**(1) Logo**
- Position: Top center
- Size: Small (text-2xl)
- Style: Gradient text

**(2) Central Icon**
- Icon: Sparkle/Wand (large, 6xl)
- Animation: Pulse (scale 1 → 1.1 → 1, infinite)
- Glow: Purple shadow-2xl

**(3a-e) Progress Steps**
- Layout: Vertical list, centered
- Icons: Emoji or SVG (left side)
- Text: 20px, right of icon
- States:
  - ✓ = Complete (green check, text-slate-400)
  - ⏳ = Pending (hourglass, text-slate-600)
  - Active = Current step (cyan color, pulse animation)

**(4) Progress Bar**
- Position: Fixed bottom (bottom-8)
- Height: 4px (thin)
- Fill: Gradient (cyan → purple)
- Animation: Width 0% → 100% over 15s
- Glow: Leading edge has shadow

**(5) Time Indicator**
- Position: Below progress bar
- Font: Monospace (Geist Mono)
- Color: Slate-500
- Updates: Countdown (15s → 0s)

### Interaction Flow:
1. Screen loads → Step 1 becomes active
2. Every 2-3s → Next step becomes active, previous shows ✓
3. Progress bar fills smoothly
4. At 100% → Redirect to generated site OR celebration screen

### Animation Details:
- Steps appear with stagger (fade up, 200ms delay each)
- Active step has rotating gradient border (360° over 2s)
- Checkmark bounces in (spring animation)
- Background gradient subtly shifts hue

---

## 📊 WIREFRAME 3: Dashboard (Bento Grid)

```
┌────────────────────────────────────────────────────────────────┐
│ QuickProSite                    user@email.com   [Sign Out] (1)│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Your Sites                           [+ Create New Site]  (2) │
│  Manage and edit your generated websites                      │
│                                                                │
│  ┌─────────────────────────┬──────────┬──────────┐           │
│  │                         │          │          │           │
│  │    [LARGE CARD]         │ [MEDIUM] │ [MEDIUM] │      (3)  │
│  │                         │          │          │           │
│  │  ┌───────────────────┐  │  Card 2  │  Card 3  │           │
│  │  │ [Preview Image]   │  │          │          │           │
│  │  └───────────────────┘  ├──────────┴──────────┤           │
│  │                         │                     │           │
│  │  Joe's Plumbing         │    [WIDE CARD]      │           │
│  │  joes.quickprosite.com  │                     │      (4)  │
│  │                         │    Card 4           │           │
│  │  [Edit] [View Live →]   │                     │           │
│  │  Created 3 days ago     │                     │           │
│  └─────────────────────────┴─────────────────────┘           │
│                                                                │
│  [If empty state:]                                             │
│  ┌────────────────────────────────────────────────┐           │
│  │                                                │           │
│  │               ┌───┐                            │           │
│  │               │ + │  No sites yet         (5) │           │
│  │               └───┘                            │           │
│  │                                                │           │
│  │  Get started by creating your first           │           │
│  │  AI-generated website in seconds.             │           │
│  │                                                │           │
│  │        [Create your first site →]             │           │
│  └────────────────────────────────────────────────┘           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Annotations:

**(1) Header**
- Height: 60px
- Background: Slate-900/80 with backdrop blur
- Border: Bottom border slate-800
- Sticky: Yes (top: 0)

Layout:
- Left: Logo (gradient text)
- Right: User email (hidden mobile) + Sign Out button

**(2) Page Header**
- Layout: Flex row, space-between
- Left: Heading + Subheading
- Right: CTA button (gradient, glowing)

**(3) Bento Grid - Site Cards**
- Grid: 12 columns, gap-4
- Card types:
  - **Large**: col-span-8, row-span-2 (has preview image)
  - **Medium**: col-span-4 (compact view)
  - **Wide**: col-span-12 (full width)

Card anatomy:
```
┌──────────────────────┐
│ [Theme Strip] (2px)  │
├──────────────────────┤
│ Site Name (bold)     │
│ subdomain.domain.com │
│ (font-mono, small)   │
│                      │
│ [Optional Preview]   │
│                      │
│ [Edit] [View Live →]│
│ Created X days ago   │
└──────────────────────┘
```

**(4) Card Styles**
- Background: Glassmorphic (slate-900/50, backdrop-blur)
- Border: Slate-800/50
- Hover: Lift (-4px translateY), glow border
- Theme strip: 2px height, gradient based on site theme

**(5) Empty State**
- Center aligned
- Dashed border (slate-700)
- Large icon (+ in circle)
- Motivational copy
- CTA button (same style as header)

### Interaction Flow:
1. Page loads → Cards fade in with stagger (100ms delay)
2. Hover card → Lift + glow effect
3. Click "Edit" → Navigate to editor
4. Click "View Live" → Open in new tab
5. Click "+ Create" → Navigate to onboarding

### Responsive Behavior:
- **Desktop (1280px+)**: 12-column bento grid, asymmetric
- **Tablet (768-1279px)**: 6-column grid, cards adjust
- **Mobile (<768px)**: Single column, all cards full width

---

## 🎛️ WIREFRAME 4: Editor (Floating Command)

```
┌────────────────────────────────────────────────────────────────┐
│ ← Back   Editing: Joe's Plumbing    [View Live →] [Save]  (1) │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│    ┌────────────────────────────────────────────────┐         │
│    │ ● ● ●  joes.quickprosite.com            ✕     │    (2)  │
│    ├────────────────────────────────────────────────┤         │
│    │                                                │         │
│    │    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓      │         │
│    │    ┃  Expert Plumbing Services       ┃  (3) │         │
│    │    ┃  [hover: dashed outline]        ┃      │         │
│    │    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛      │         │
│    │                                                │         │
│    │    Your trusted local plumber               │         │
│    │    [hover: dashed outline]                   │         │
│    │                                                │         │
│    │    ┌──────────────┐                          │         │
│    │    │ Call Us Now  │  [hover: scale]         │         │
│    │    └──────────────┘                          │         │
│    │                                                │         │
│    │    ┌──────┐ ┌──────┐ ┌──────┐                │    (4)  │
│    │    │Service│ │Service│ │Service│              │         │
│    │    │  [1]  │ │  [2]  │ │  [3]  │              │         │
│    │    └──────┘ └──────┘ └──────┘                │         │
│    │                                                │         │
│    └────────────────────────────────────────────────┘         │
│                                                                │
│                              ┌───┐                             │
│                              │ ⚡ │  [Floating Action]    (5) │
│                              └───┘  [bottom-right]            │
│                                                                │
│     ┌────┐                                                    │
│     │🎲  │  [Remix Button]                              (6)  │
│     │    │  [bottom-left]                                    │
│     └────┘                                                    │
│                                                                │
│  ┌─────────────────────────────────────────────┐              │
│  │ [Command Palette - Overlay]                │         (7)  │
│  │                                             │              │
│  │  🔍 Type a command or search...            │              │
│  │  ─────────────────────────────────────────  │              │
│  │  Quick Actions                              │              │
│  │  ✨ Remix Layout                            │              │
│  │  🎨 Change Theme                            │              │
│  │  📝 Edit Hero Section                       │              │
│  │                                             │              │
│  │  AI Tools                                   │              │
│  │  🤖 AI: Improve Headline                    │              │
│  │  🤖 AI: Rewrite About                       │              │
│  └─────────────────────────────────────────────┘              │
└────────────────────────────────────────────────────────────────┘
```

### Annotations:

**(1) Top Header**
- Height: 60px
- Background: Slate-900/95, backdrop blur
- Border: Bottom slate-800
- Layout:
  - Left: Back button + Site name
  - Right: View Live link + Save button

**(2) Browser Chrome Mockup**
- Dots: Traffic lights (●●●)
- URL bar: Shows subdomain
- Close button: Right side
- This simulates "live preview"

**(3) Editable Content Areas**
- Default state: No visible UI
- Hover state: Dashed cyan outline (border-2 border-dashed border-cyan-500/50)
- Click state:
  - Element becomes `contentEditable`
  - Floating toolbar appears above (see wireframe 4b below)
- Cursor: Changes to text cursor on hover

**(4) Preview Content**
- Renders actual site content
- All text elements are hoverable/clickable
- Images have hover state (swap icon overlay)

**(5) Floating Action Button (FAB)**
- Position: `fixed bottom-8 right-8`
- Size: 64x64px circle
- Icon: Lightning bolt (⚡)
- Gradient background, purple glow
- Click → Opens Command Palette (7)
- Keyboard shortcut: ⌘K / Ctrl+K

**(6) Remix Button**
- Position: `fixed bottom-8 left-8`
- Size: Auto width, rounded-xl
- Text: "🎲 Remix Layout"
- Gradient: Purple → Pink
- Click → Instant theme cycle
- Hover → Show 3 theme thumbnails

**(7) Command Palette (Overlay)**
- Position: Centered modal
- Size: max-w-2xl
- Background: Slate-900, border slate-700
- Sections:
  - Search input (top, no border)
  - Grouped command list (scrollable)
  - Each item: Icon + Text + Shortcut

### Wireframe 4b: Inline Editing Toolbar

```
         ┌─────────────────────────────────┐
         │ B  I  🤖 Rewrite  ↶ Undo      │  ← Floating above text
         └─────────────────────────────────┘
                     ▼
         ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
         ┃ [Editable Text Here]       ┃  ← User is editing
         ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Toolbar appears:
- Position: Absolute, above selected element
- Style: Slate-900, border slate-700, shadow-xl
- Buttons: Bold, Italic, AI Rewrite, Undo
- Auto-hides on blur (with auto-save)

### Interaction Flow:
1. User arrives at editor → Sees full preview
2. Hover text → Dashed outline appears
3. Click text → Inline editing mode + toolbar
4. Edit text → Auto-save on blur (show toast "✓ Saved")
5. Press ⌘K → Command palette opens
6. Select command → Action executes
7. Click Remix → Theme cycles with crossfade animation

### Key UX Principles:
- **Zero sidebar**: All controls via overlay/inline
- **Context over menus**: Right-click section → contextual actions
- **Undo-friendly**: Every action can be undone
- **Auto-save**: No manual save needed (but button available)

---

## 📱 WIREFRAME 5: Mobile Onboarding (Bonus)

```
┌──────────────────────┐
│                      │
│   ● ○ ○   (Progress)│  (1)
│                      │
│                      │
│       ✨             │
│   [Large Icon]       │  (2)
│                      │
│                      │
│   Build Your Site    │
│   in 30 Seconds      │  (3)
│                      │
│   No code. No stress.│
│   Just results.      │
│                      │
│                      │
│  ┌────────────────┐  │
│  │ Get Started →  │  │  (4)
│  └────────────────┘  │
│                      │
│  [Swipe left →]      │  (5)
│                      │
└──────────────────────┘

   ← Swipe to Step 2 →

┌──────────────────────┐
│                      │
│   ○ ● ○              │  (1)
│                      │
│  What do you do?     │  (6)
│                      │
│  ┌────────────────┐  │
│  │ 🔧 Plumber  ▼  │  │  (7)
│  └────────────────┘  │
│                      │
│  Where are you?      │
│                      │
│  ┌────────────────┐  │
│  │ 📍 Austin, TX  │  │  (8)
│  └────────────────┘  │
│                      │
│                      │
│  ┌────────────────┐  │
│  │ Next →         │  │  (9)
│  └────────────────┘  │
│                      │
│  Skip              │  │  (10)
│                      │
└──────────────────────┘
```

### Annotations:

**(1) Progress Dots**
- Position: Top center
- 3 dots: Step 1, 2, 3
- Active dot: Cyan, scale-125
- Inactive: Slate-700

**(2) Icon**
- Size: Large (text-6xl)
- Animated: Gentle float/pulse
- Changes per step

**(3) Headline**
- Size: Large (text-4xl)
- Gradient text
- Center aligned

**(4) CTA Button**
- Width: Full (minus padding)
- Height: 56px (touch-friendly)
- Gradient background
- Fixed to bottom of viewport

**(5) Swipe Indicator**
- Small text hint
- Fade out after 2s
- Optional: Animated arrow

**(6-8) Form Fields (Step 2)**
- Large labels (text-lg)
- Inputs have min height 56px (touch target)
- Icons for visual clarity

**(9) Next Button**
- Same style as Get Started
- Sticky bottom

**(10) Skip Link**
- Ghost link
- Positioned below button
- Text: "Skip for now"

### Mobile-Specific Considerations:
- **Touch targets**: Minimum 44x44px (Apple), 48x48px (Material)
- **Font size**: Minimum 16px to prevent zoom on iOS
- **Spacing**: Generous padding (min 16px)
- **Swipe gestures**: Smooth spring animations
- **Keyboard**: Input fields scroll into view when focused
- **Bottom CTA**: Always visible (sticky positioning)

---

## 📏 Layout Grid System

All screens use consistent spacing scale:

```
Spacing Scale (Tailwind):
- 1 unit  = 4px   (p-1)
- 2 units = 8px   (p-2)
- 4 units = 16px  (p-4)  ← Base spacing
- 6 units = 24px  (p-6)
- 8 units = 32px  (p-8)
- 12 units = 48px (p-12)

Max Widths:
- sm: 640px   (mobile)
- md: 768px   (tablet)
- lg: 1024px  (small desktop)
- xl: 1280px  (desktop)
- 2xl: 1536px (large desktop)

Content Containers:
- Landing: max-w-2xl
- Dashboard: max-w-7xl
- Editor Preview: max-w-5xl
- Modals: max-w-md or max-w-2xl
```

---

## ✅ Wireframe Approval Checklist

Before moving to high-fidelity:

- [ ] Layout proportions feel balanced
- [ ] Information hierarchy is clear (what user sees first)
- [ ] Interactive elements are obvious (buttons, links, inputs)
- [ ] Mobile versions are touch-friendly
- [ ] Flow between screens makes sense
- [ ] Empty states are handled
- [ ] Error states are considered
- [ ] Loading states are designed

---

## 🔄 Iteration Notes

Common revisions after wireframe review:

1. **Spacing adjustments**: Add more breathing room
2. **Hierarchy changes**: Make CTAs more prominent
3. **Content reduction**: Remove non-essential elements
4. **Flow simplification**: Reduce steps in onboarding
5. **Mobile optimization**: Enlarge touch targets

---

**Status**: Wireframes complete ✓
**Next**: Create full UX specification (#1)

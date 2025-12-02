# QuickProSite - AI-Ready Mockup Prompts

**Purpose**: Copy-paste these prompts into v0.dev, Lovable, or other AI design tools to generate high-fidelity mockups.

**Design System Reference**: All prompts use the QuickProSite dark mode design system:
- Background: `#0a0a0f` → `#1a1a24` → `#2a2a3a` (slate-950 → slate-900 → slate-800)
- Accent Gradient: Cyan (#06b6d4) → Purple (#8b5cf6)
- Glow Gradient: Purple (#8b5cf6) → Pink (#ec4899)
- Typography: Geist Sans (headings), Geist Mono (code/subdomains)

---

## 🎯 SCREEN 1: Landing/Onboarding Page (Mad Libs Style)

### Prompt for v0/Lovable:

```
Create a modern, dark-themed landing page for an AI website builder called QuickProSite. Use Next.js 14, TypeScript, and Tailwind CSS.

LAYOUT:
- Full-screen centered design with dark gradient background (from-slate-950 via-slate-900 to-slate-950)
- Floating "Login to Dashboard →" link in top-right corner (text-slate-400, hover:text-cyan-400)
- Main content vertically centered

HERO SECTION:
- Extra large headline (text-7xl, font-bold): "Your Site. Built by AI."
  - Apply gradient text: bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent
- Subheadline below (text-xl, text-slate-400): "Zero code. Zero effort. Ready in 30 seconds."
- Add subtle text shadow/glow effect to headline

ONBOARDING FORM (Glassmorphic Card):
- Card styling:
  - bg-slate-900/50 with backdrop-blur-xl
  - border: 1px solid rgba(148, 163, 184, 0.1)
  - rounded-2xl with shadow-2xl
  - p-8

- TWO INPUT SECTIONS (stacked vertically, not side-by-side):

SECTION 1 - Google Business Search (Prominent):
- Label: "Find Your Business on Google" (text-slate-300, font-medium)
- Search input with icon:
  - w-full, bg-slate-800, border-slate-700
  - Glow border on focus (border-cyan-500, ring-2 ring-cyan-500/50)
  - Placeholder: "Search for your business..."
  - Magnifying glass icon on left
- Success state box (when found):
  - Green-tinted background (bg-emerald-950/30, border-emerald-500/30)
  - Text: "✓ Found: [Business Name]" (text-emerald-400)
  - Show rating stars if available

DIVIDER:
- Horizontal line with "OR" in center
- Style: text-slate-500, border-slate-700

SECTION 2 - Manual Entry ("Mad Libs" Style):
- Large inline sentence format (text-2xl):
  - "I'm a" [dropdown] "in" [text input]
  - Dropdowns and inputs inline with text, not stacked
  - All text-slate-300

- Industry Dropdown:
  - Inline, width: min-w-[200px]
  - bg-slate-800, border-b-2 border-cyan-500
  - Options: Plumber, HVAC Tech, Electrician, Landscaper
  - Focus state: border-purple-500

- City Input:
  - Inline, width: min-w-[200px]
  - bg-slate-800, border-b-2 border-cyan-500
  - Placeholder: "Austin, TX"
  - Focus state: border-purple-500

GENERATE BUTTON:
- Full width, mt-8
- Gradient background: bg-gradient-to-r from-cyan-500 to-purple-600
- text-white, py-4, rounded-xl, font-bold, text-lg
- Glow effect: shadow-lg shadow-purple-500/50
- Hover state: scale-105 transform
- Text: "Generate My Site ✨"

INTERACTIONS:
- Input fields glow on focus
- Button has magnetic hover effect (subtle lift)
- Smooth transitions (0.3s ease)

RESPONSIVE:
- Mobile: Stack elements, reduce headline to text-5xl
- Desktop: Max width 2xl, centered
```

---

## ⚡ SCREEN 2: Loading/Generation State (Animated)

### Prompt for v0/Lovable:

```
Create a full-screen loading state for an AI website generation process. Use Next.js 14, TypeScript, Tailwind CSS, and Framer Motion for animations.

LAYOUT:
- Full viewport height (min-h-screen)
- Dark gradient background with animated mesh:
  - Base: bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950
  - Add animated gradient overlay that shifts position

CONTENT (Vertically Centered):
- Logo/Brand at top: "QuickProSite" (text-2xl, gradient text cyan→purple)

MAIN STATUS AREA:
- Large central icon area (animated pulse):
  - Show a sparkle/wand icon (text-6xl)
  - Pulse animation (scale 1 → 1.1 → 1)
  - Glow effect (shadow-2xl shadow-purple-500/50)

PROGRESS STEPS (Vertical List):
- Show 5 steps with icons and text:
  1. "🧠 Analyzing your industry"
  2. "✍️ Writing your copy"
  3. "🎨 Designing your layout"
  4. "🖼️ Selecting images"
  5. "🚀 Launching your site"

- Each step has 3 states:
  - PENDING: text-slate-600, icon grayscale
  - ACTIVE: text-cyan-400, icon colored, pulse animation, gradient glow
  - COMPLETE: text-slate-400, green checkmark ✓, fade in

- Step styling:
  - Flex row, items-center, gap-4
  - Icon in circle (w-12 h-12, rounded-full, bg-slate-800)
  - Text (text-xl, font-medium)
  - Animate appearance: fade up (translateY 20px → 0)

PROGRESS BAR (Subtle):
- Bottom of screen (fixed bottom-8)
- Thin line (h-1) with gradient fill
- bg-slate-800 base
- Gradient fill: bg-gradient-to-r from-cyan-500 to-purple-600
- Smooth width animation (0% → 100% over 15 seconds)
- Add glow to the leading edge

TIME INDICATOR:
- Below progress bar: "Building your site... ~15 seconds remaining"
- text-slate-500, text-sm, font-mono

ANIMATIONS:
- Steps appear sequentially (stagger 2s apart)
- Active step has rotating gradient border
- Checkmark bounces in when complete
- Background gradient subtly shifts colors

MICRO-INTERACTION:
- Particle effects floating upward (optional, if tool supports)
- Subtle screen-edge glow that pulses with progress
```

---

## 📊 SCREEN 3: Dashboard (Bento Grid Layout)

### Prompt for v0/Lovable:

```
Create a modern dashboard for managing AI-generated websites. Use Next.js 14, TypeScript, Tailwind CSS. Apply dark mode with glassmorphism and bento grid layout.

LAYOUT:
- Full screen, bg-gradient-to-br from-slate-950 to-slate-900
- Sticky header at top
- Main content area with bento grid

HEADER (Sticky, backdrop-blur):
- bg-slate-900/80, backdrop-blur-md, border-b border-slate-800
- Flex row, justify-between, items-center
- Padding: px-6 py-4

Left Side:
- Logo: "QuickProSite" (text-xl, font-bold, gradient text cyan→purple)

Right Side:
- User email (text-slate-400, text-sm, hidden on mobile)
- Sign Out button (text-slate-500, hover:text-slate-300, px-3 py-1.5, rounded-lg, hover:bg-slate-800)

MAIN CONTENT AREA:
- Max width: 7xl, mx-auto, px-6, py-8

PAGE HEADER:
- Flex row, justify-between, items-center, mb-8

Left:
- Heading: "Your Sites" (text-3xl, font-bold, text-slate-100)
- Subheading: "Manage and edit your generated websites" (text-slate-400, text-sm, mt-1)

Right:
- "+ Create New Site" button:
  - bg-gradient-to-r from-cyan-500 to-purple-600
  - text-white, px-5, py-2.5, rounded-xl, font-medium
  - Glow: shadow-lg shadow-purple-500/25
  - Hover: scale-105, brighter glow

BENTO GRID (Sites Display):
- CSS Grid with asymmetric layout (not uniform cards)
- grid-cols-12, gap-4

SITE CARD VARIANTS (3 types):

TYPE 1 - Large Card (col-span-8, row-span-2):
- Glassmorphic background: bg-slate-900/50, backdrop-blur-lg
- Border: border border-slate-800/50
- Rounded-xl, overflow-hidden
- Hover: lift effect (translateY -4px), glow border (border-purple-500/50)

Card Content:
- Theme color strip at top (h-2, gradient based on theme)
- Padding: p-6
- Site name: text-2xl, font-bold, text-slate-100
- Subdomain: text-slate-400, font-mono, text-sm
- Large preview thumbnail (rounded-lg, aspect-video, bg-slate-800)
- Action buttons at bottom (Edit, View Live)

TYPE 2 - Medium Card (col-span-4):
- Same styling as Type 1, but smaller
- No preview thumbnail
- Just name, subdomain, actions

TYPE 3 - Small Card (col-span-4):
- Compact version

EMPTY STATE (if no sites):
- Centered card with border-2 border-dashed border-slate-700
- Rounded-2xl, p-12, text-center
- Icon: Large + symbol in circle (bg-slate-800, w-16 h-16, text-slate-600)
- Heading: "No sites yet" (text-lg, font-semibold, text-slate-200)
- Description: "Get started by creating your first AI-generated website in seconds." (text-slate-400)
- CTA button: Same gradient style as header button

ACTION BUTTONS ON CARDS:
- Edit button:
  - border border-slate-700, text-slate-300
  - hover:bg-slate-800, hover:border-slate-600
  - Pencil icon + "Edit" text

- View Live link:
  - text-cyan-400, hover:text-cyan-300
  - External link icon + "View Live"

ANIMATIONS:
- Cards fade in on load (stagger 100ms)
- Hover states smooth (0.2s ease)
- Grid rearranges smoothly when items added/removed

RESPONSIVE:
- Desktop: 12-column bento grid
- Tablet: 6-column grid, cards adjust span
- Mobile: Single column, all cards full width
```

---

## 🎛️ SCREEN 4: Editor (Floating Command Interface)

### Prompt for v0/Lovable:

```
Create a revolutionary website editor with no sidebar. Full-screen preview with floating command interface. Use Next.js 14, TypeScript, Tailwind CSS, and Radix UI for the command palette.

LAYOUT:
- Three layers: Header (sticky), Preview (full), Floating Command (overlay)

HEADER (Sticky Top):
- bg-slate-900/95, backdrop-blur-md, border-b border-slate-800
- Height: 60px
- Flex row, justify-between, items-center, px-6

Left Side:
- Back button: "← Back" (text-slate-400, hover:text-slate-200)
- Site name: "Editing: [Site Name]" (text-slate-200, font-semibold, ml-4)

Right Side:
- View Live button: "View Live Site →" (text-cyan-400, hover:text-cyan-300)
- Save button:
  - bg-cyan-600, hover:bg-cyan-500
  - text-white, px-6, py-2, rounded-lg
  - Show "Saving..." state with spinner

PREVIEW AREA (Full Screen):
- Background: bg-slate-950
- Main content area simulates live website in iframe-style box:
  - Max width: 5xl, mx-auto, my-8
  - bg-white, rounded-xl, shadow-2xl
  - Show browser chrome mockup at top (dots, URL bar)

EDITABLE ELEMENTS (In Preview):
- All text elements have subtle hover state:
  - Dashed outline: border-2 border-dashed border-cyan-500/0
  - On hover: border-cyan-500/50, cursor-text
  - Click → contentEditable mode

FLOATING ACTION BUTTON (FAB):
- Fixed position: bottom-8, right-8
- Large circular button (w-16 h-16)
- Gradient background: bg-gradient-to-br from-cyan-500 to-purple-600
- Lightning bolt icon (text-white, text-2xl)
- Glow: shadow-2xl shadow-purple-500/50
- Hover: scale-110, rotate-12
- Click → Opens Command Palette

COMMAND PALETTE (Radix Dialog):
- Triggered by FAB or keyboard shortcut (⌘K)
- Overlay: bg-black/60, backdrop-blur-sm
- Dialog box centered:
  - Width: max-w-2xl
  - bg-slate-900, border border-slate-700
  - rounded-2xl, shadow-2xl
  - Divide into sections

COMMAND PALETTE STRUCTURE:

Search Input (Top):
- w-full, bg-slate-800, border-b border-slate-700
- px-6, py-4, text-slate-100, text-lg
- Placeholder: "Type a command or search..."
- Magnifying glass icon on left
- No border, focus:ring-0

Command List (Scrollable):
- Max height: 400px, overflow-y-auto
- Grouped by category

CATEGORY: Quick Actions
- "✨ Remix Layout" → Cycle through themes
- "🎨 Change Theme" → Color picker
- "📝 Edit Hero Section" → Focus hero
- "🔄 Regenerate Section" → AI regenerate

CATEGORY: Sections
- "➕ Add Section" → Section picker
- "🗑️ Remove Section" → Confirmation
- "↕️ Reorder Sections" → Drag mode

CATEGORY: AI Tools
- "🤖 AI: Improve Headline" → Smart suggestions
- "🤖 AI: Rewrite About" → Content regeneration
- "🤖 AI: Suggest Services" → Auto-populate

Each Command Item:
- Flex row, items-center, px-6, py-3
- Hover: bg-slate-800
- Icon (text-2xl) + Text (text-slate-200) + Keyboard shortcut (text-slate-500, text-xs)

"REMIX" BUTTON (Prominent, Always Visible):
- Fixed position: bottom-8, left-8
- Gradient button: bg-gradient-to-r from-purple-500 to-pink-500
- px-6, py-3, rounded-xl, font-bold
- Text: "🎲 Remix Layout"
- Click → Instant theme change with smooth transition
- Show theme preview thumbnails on hover (3 options)

INLINE EDITING MODE:
- When text is clicked:
  - Element becomes contentEditable
  - Floating toolbar appears above element:
    - bg-slate-900, border border-slate-700, rounded-lg, shadow-xl
    - Buttons: Bold, Italic, AI Rewrite, Undo
  - Auto-save on blur (show "✓ Saved" toast)

UNDO/REDO:
- Fixed position: top-20, right-6
- Small pill: bg-slate-800, px-3, py-1.5, rounded-full
- Undo/Redo icons with keyboard shortcuts
- Show last action: "Undo: Changed headline" (fade out after 3s)

ANIMATIONS:
- Command palette slides up from bottom (spring animation)
- Commands fade in with stagger
- Remix transition: crossfade (0.5s ease)
- Save confirmation: slide down from top

RESPONSIVE:
- Desktop: Full floating interface
- Mobile: Command palette becomes bottom sheet (slides up)
```

---

## 🎨 SCREEN 5: Component Library Showcase

### Prompt for v0/Lovable:

```
Create a component library showcase page demonstrating all reusable QuickProSite UI components. Use Next.js 14, TypeScript, Tailwind CSS. Dark mode theme.

LAYOUT:
- Full screen, bg-slate-950
- Sidebar navigation (left, w-64, sticky)
- Main content area (scrollable)

SIDEBAR:
- bg-slate-900, border-r border-slate-800
- Padding: p-6

Logo at top:
- "QuickProSite" (gradient text, text-xl, font-bold)

Navigation sections:
1. Buttons
2. Inputs
3. Cards
4. Dialogs
5. Animations

Each nav item:
- text-slate-400, hover:text-cyan-400
- Smooth scroll to section

MAIN CONTENT (px-12, py-8):
- Max width: 5xl

Each Component Section:
- Section heading (text-3xl, font-bold, text-slate-100, mb-8)
- Grid of component examples (gap-8)

---

SECTION 1: BUTTONS

Show 6 button variants in 2x3 grid:

1. Primary Button (Gradient):
   - bg-gradient-to-r from-cyan-500 to-purple-600
   - text-white, px-6, py-3, rounded-xl, font-bold
   - shadow-lg shadow-purple-500/50
   - hover:scale-105

2. Secondary Button (Ghost):
   - border border-slate-700, text-slate-300
   - hover:bg-slate-800, hover:border-slate-600

3. Danger Button:
   - bg-red-600, hover:bg-red-500
   - text-white

4. Icon Button (Circular):
   - w-12 h-12, rounded-full
   - bg-slate-800, hover:bg-slate-700
   - Icon centered

5. Loading Button:
   - Same as Primary but with spinner animation
   - Text: "Loading..."

6. Disabled Button:
   - Opacity 50%, cursor-not-allowed

For each button:
- Show code snippet below (bg-slate-900, p-4, rounded-lg, font-mono, text-xs)
- Copy button in top-right

---

SECTION 2: INPUTS

Show 5 input variants:

1. Text Input (Default):
   - bg-slate-800, border border-slate-700
   - px-4, py-3, rounded-lg
   - focus:ring-2 focus:ring-cyan-500 focus:border-transparent
   - text-slate-100

2. Text Input (With Icon):
   - Same as above with leading icon (search, email, etc.)

3. Text Input (With Glow):
   - Border glows on focus (border-cyan-500, ring-2 ring-cyan-500/50)

4. Textarea:
   - Same styling, rows-4

5. Select Dropdown:
   - Custom styled with Radix Select
   - Same color scheme

For each input:
- Show label above (text-slate-300, text-sm, font-medium, mb-2)
- Show placeholder text
- Show focus state

---

SECTION 3: CARDS

Show 4 card variants in 2x2 grid:

1. Glassmorphic Card:
   - bg-slate-900/50, backdrop-blur-lg
   - border border-slate-800/50
   - rounded-2xl, p-6
   - Sample content inside

2. Glow Card (Hover State):
   - Same as glassmorphic
   - hover:border-purple-500/50
   - hover:shadow-2xl hover:shadow-purple-500/20
   - transform hover:-translate-y-1

3. Bento Card (Large):
   - col-span-2, aspect-video
   - Gradient background
   - Content overlaid

4. Stats Card:
   - Small card with large number
   - Icon, title, value, change indicator

---

SECTION 4: DIALOGS & OVERLAYS

Show 3 examples:

1. Modal Dialog:
   - Centered overlay
   - bg-slate-900, border border-slate-700
   - rounded-2xl, max-w-md, p-6
   - Close button (X) in top-right

2. Command Palette:
   - Search input + command list
   - Same styling as editor command palette

3. Toast Notification:
   - Fixed position (top-4, right-4)
   - bg-green-500, text-white, px-6, py-3, rounded-lg
   - Slide in animation

---

SECTION 5: ANIMATIONS

Show 6 animation examples:

1. Fade In:
   - Box that fades in on scroll

2. Slide Up:
   - Box that slides up from bottom

3. Scale:
   - Box that scales up

4. Glow Pulse:
   - Box with pulsing glow effect

5. Loading Spinner:
   - Gradient circular spinner

6. Skeleton Loader:
   - Animated gradient placeholder

Each animation:
- Trigger button to replay
- Show CSS/Framer Motion code

---

GLOBAL STYLING:
- All code snippets: bg-slate-900, text-cyan-400, font-mono, text-xs
- All section dividers: border-t border-slate-800, mt-16, pt-16
- Copy buttons: Absolute top-right of code blocks, text-slate-500, hover:text-cyan-400

INTERACTIONS:
- Hover any component → highlight with subtle glow
- Click any component → show props table
- Copy button → clipboard + toast "Copied!"
```

---

## 🎯 BONUS: Mobile Onboarding (Simplified)

### Prompt for v0/Lovable:

```
Create a mobile-optimized version of the QuickProSite onboarding flow. Use Next.js 14, TypeScript, Tailwind CSS. Swipeable multi-step form.

LAYOUT:
- Full screen mobile view (max-w-md)
- Dark gradient background
- Multi-step wizard (3 steps)

PROGRESS INDICATOR (Top):
- Horizontal dots (3 dots)
- Active dot: bg-cyan-500, scale-125
- Inactive: bg-slate-700
- Animate dot transitions

STEP 1: Welcome
- Large animated icon (sparkle/wand)
- Headline: "Build Your Site in 30 Seconds" (text-4xl, gradient)
- Subheadline: "No code. No stress. Just results."
- CTA: "Get Started →" (full-width gradient button)
- Swipe left to continue

STEP 2: Business Details
- Card with 2 inputs (stacked):
  1. Industry picker (large tap targets)
  2. City input (with location icon)
- Skip button (top-right, text-slate-400)
- Next button (bottom, full-width)

STEP 3: Optional Google Search
- Google Business search (same as desktop)
- Or "Skip and use AI" button
- Final CTA: "Generate My Site ✨"

INTERACTIONS:
- Swipe gestures between steps
- Progress dots update on swipe
- All buttons have haptic feedback (indicate in code)
- Smooth spring animations

RESPONSIVE:
- Optimized for touch (min tap target 44px)
- Large typography (min 16px)
- Bottom CTA always visible (sticky)
```

---

## 📝 Usage Instructions

### For v0.dev:
1. Copy the full prompt for desired screen
2. Paste into v0.dev chat interface
3. Click "Generate"
4. Iterate with: "Make the glow effect stronger" or "Add more spacing"

### For Lovable:
1. Start new project
2. Paste prompt as initial instruction
3. Review generated code
4. Request refinements: "Adjust gradient colors to match brand"

### For Midjourney (Static Mockups Only):
1. Simplify prompt to visual-only elements
2. Add: "UI/UX design, Figma screenshot, dark mode, glassmorphism"
3. Remove code-specific instructions

### For Figma Plugin (Relume, Galileo AI):
1. Use shorter prompts focused on layout
2. Specify: "Dark mode website builder dashboard"
3. Manually apply color system after generation

---

## 🎨 Color Palette Reference (For All Prompts)

Copy this into your design tool variables:

```css
/* Backgrounds */
--bg-primary: #0a0a0f;    /* slate-950 */
--bg-secondary: #1a1a24;  /* slate-900 */
--bg-tertiary: #2a2a3a;   /* slate-800 */

/* Gradients */
--gradient-primary: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
--gradient-glow: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);

/* Text */
--text-primary: #f8fafc;   /* slate-50 */
--text-secondary: #94a3b8; /* slate-400 */

/* Borders */
--border-subtle: rgba(148, 163, 184, 0.1);
--border-glow: rgba(139, 92, 246, 0.3);
```

---

## ✅ Next Steps

After generating mockups:
1. Review with stakeholders
2. Iterate on visual details (spacing, colors, animations)
3. Move to wireframes (#3) for layout validation
4. Create full spec (#1) for development handoff
5. Build component library (#4) for consistency
6. Follow implementation checklist (#5) to build

**Status**: Mockup prompts complete ✓
**Next**: Generate wireframes (#3)

High-Conversion Industrial Landing Page
We successfully built the METALLYX public landing page using the custom Neobrutalist-Industrial design system.

🏗️ Architecture & Navigation
SEO & Public Access: The root / route now returns a robust landing page (no login required).
Sticky Navbar: A bold, bordered navbar providing quick links to Sign In and Get a Quote (Register OEM).
Post-Auth Redirection: If a user is already logged in, the root page instantly redirects them to their respective dashboards (/oem/dashboard, /vendor/jobs, etc.).
🎨 Implemented Components
All custom components were built from scratch using raw DOM manipulation and framer-motion to bypass complex dependency installations, directly resulting in stable, lightweight files under components/landing/.

1. The Hero Section (The "Digital Factory")
Uses a fading abstract grid background mimicking blueprints.
Employs bold uppercase typography (Inter / Roboto Mono).
Features a Framer Motion Lift Effect: Buttons actively pop upwards with solid, thick offset shadows 
(boxShadow: 8px 8px 0px #111827)
.
2. Network Stats (Live Ribbon)
A seamlessly animating, infinite moving marquee.
Bright #F97316 (Safety Orange) with striking typography declaring technical proof (0.01MM MAX TOLERANCE).
3. How It Works (Blueprint-to-Part)
A connected sequential grid using Lucide icons.
When an element loads/focuses, it triggers a "Scanning line" that loops vertically—mimicking "AI Analysis".
4. The Machine Room (Bento Grid)
A responsive capability grid demonstrating heavy industrial styling.
MIN TOLERANCE badges visually stamped on each card.
Floating transition states (hover:-translate-y-1 hover:shadow-[10px_10px_0]).
5. Trust Pillars (Sticky Scroll Concept)
Scroll directionally triggers horizontal entrance animations (x: -50 -> x: 0).
Tags explicitly note value propositions for 
OEM
 or VENDOR.
6. Founders Pledge (Tracing Beam)
Features a custom useScroll framer-motion behavior spanning the container height.
As the user scrolls, a glowing orange beam traces downwards parallel to the Founders' quote.
An animated, infinite-spinning "Verified" seal acts as the signature anchor.
Ensure your development server is running (npm run dev) to test the smooth Framer Motion transitions across the long-form scroll.

7. Neobrutalist UI Polish
Vendor Dashboards: Applied strict industrial themes (bg-industrial-bg, text-industrial-text, flat boxes, hex-based borders) to app/vendor/dashboard, app/vendor/jobs, and app/vendor/my-jobs.
OEM Dashboards: Styled the OEM Dashboard metrics, tables, and the "Post a New Job" form to use the same thick-bordered Neobrutalist design with industrial color tones.
Admin Dashboards: Transformed the simple Admin cards into heavy, shadowed UI elements that encourage direct interaction.
Auth Forms: Restyled the Card Wrapper, Login Form, and Register Form with bg-industrial-orange accent headers, monospace inputs, and stark action buttons to maintain design consistency from the very first login screen.
Tech Highlights: Ensured zero rounded properties, enforced border-2 border-slate-900, hard shadow-[4px_4px_0px_#0F172A] and shadow-[8px_8px_0px_#0F172A], and capitalized typography (font-bold uppercase tracking-wider).


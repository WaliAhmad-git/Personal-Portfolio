/* app/page.tsx
   M5 — Homepage restructure. The homepage is now a summary/landing
   page only. Full project list lives at /projects. The About bio and
   timeline live at /about. Skills detail lives at /skills.

   Section order (top → bottom):
     Hero → What I Do (DomainCards) → Tech Stack → Featured Projects
     → Why Hire Me → Contact

   Sections removed from homepage vs previous build:
   - About (bio + status block) → /about
   - Timeline / Journey → /about
   - CurrentlySection → /about
   - Full Projects list → /projects

   Components untouched: Navbar, ResumeButton live in layout.tsx.
   Contact.tsx renders its own <footer> — no separate Footer import needed.
*/

import Hero             from '@/components/sections/Hero'
import DomainCards      from '@/components/sections/DomainCards'
import TechStack        from '@/components/3d/TechStack'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import WhyHireMe        from '@/components/sections/WhyHireMe'
import Contact          from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      {/* 01 — Name, title, typewriter, stats */}
      <Hero />

      {/* 02 — Four domain cards: Frontend / Backend / Security / ML */}
      <DomainCards />

      {/* 03 — Matter.js tech balls (existing component, unchanged) */}
      <TechStack />

      {/* 04 — 3 featured projects + "View All Projects" → /projects */}
      <FeaturedProjects />

      {/* 05 — Value proposition: why hire this engineer */}
      <WhyHireMe />

      {/* 06 — Contact form + footer */}
      <Contact />
    </main>
  )
}

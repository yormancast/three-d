import type { MotionId } from '@/scene/motionPlayback'
import type { CameraPresetId } from './scenePresets'

export const sectionIds = ['home', 'bio', 'projects', 'experience', 'contact'] as const
export type SectionId = (typeof sectionIds)[number]

export interface SectionPresentation {
  cameraId: CameraPresetId
  motionId: MotionId
  anchorId: 'seated' | 'standing' | null
}

export interface PortfolioLink {
  label: string
  href: string
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
  contribution: string | null
  technologies: readonly string[]
  links: readonly PortfolioLink[]
}

export interface PortfolioExperience {
  id: string
  role: string
  organization: string | null
  period: {
    label: string
    startDate: string | null
    endDate: string | null
  } | null
  description: string
  technologies: readonly string[]
}

interface SectionBase<Id extends SectionId> {
  id: Id
  label: string
  presentation: SectionPresentation
  nextSection: SectionId | null
}

export interface HomeSection extends SectionBase<'home'> {
  title: string
}

export interface BioSection extends SectionBase<'bio'> {
  title: string
  body: string | null
  chips: readonly string[] | null
}

export interface ProjectsSection extends SectionBase<'projects'> {
  title: string
  projects: readonly PortfolioProject[]
}

export interface ExperienceSection extends SectionBase<'experience'> {
  title: string
  body: string | null
  experience: readonly PortfolioExperience[]
}

export interface ContactSection extends SectionBase<'contact'> {
  title: string
  body: string | null
  links: readonly PortfolioLink[]
}

export type PortfolioSection = HomeSection | BioSection | ProjectsSection | ExperienceSection | ContactSection

export const sections = [
  {
    id: 'home',
    label: 'Home',
    presentation: { cameraId: 'Inicio', motionId: 'Recovery', anchorId: null },
    nextSection: null,
    title: 'Yorman Castellanos',
  },
  {
    id: 'bio',
    label: 'Bio',
    presentation: { cameraId: 'Bio', motionId: 'Dribble', anchorId: 'seated' },
    nextSection: 'projects',
    title: 'Full-stack developer focused on frontend and 3D',
    body: 'Born in Venezuela and now living in Chile, I’ve been coding for more than a decade, mostly in JavaScript. I’m technically a full-stack developer, but my passion is frontend and 3D. I love building with Three.js, from canvas animations to materials and UV mapping. I’ve also explored Python and C++.',
    chips: ['JavaScript', 'Three.js'],
  },
  {
    id: 'projects',
    label: 'Projects',
    presentation: { cameraId: 'Projects', motionId: 'Crossover', anchorId: 'seated' },
    nextSection: 'experience',
    title: 'Projects',
    projects: [
      {
        id: 'vans-customizer',
        title: 'Vans Customizer',
        description:
          'A real-time 3D experience for customizing Vans footwear. Over a decade, I helped build and evolve the entire frontend, most recently serving as Frontend Tech Lead and Architecture Lead.',
        contribution: null,
        technologies: ['Three.js', 'WebGL', 'Vue', 'TypeScript'],
        links: [{ label: 'Link', href: 'https://www.vans.com/en-us/customizer/authentic-classic' }],
      },
      {
        id: 'interactive-portfolio',
        title: 'Interactive Portfolio',
        description:
          'I built the original version of this site by hand with Vue and Three.js. This time around, I used Claude Code to bring the architecture up to date. The character started as an idea I sketched by hand and worked on with ChatGPT. The court and the overall look came from my own ideas too, which I bounced around with Opus 5.5. Astra took it all into Blender and did the heavy lifting: the character, the environment, textures, rigging, and all those basketball moves. Sol kept the multi-agent development process moving and helped bring it all together.',
        contribution: null,
        technologies: ['Vue', 'Three.js', 'TypeScript', 'Blender'],
        links: [],
      },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    presentation: { cameraId: 'Experience', motionId: 'Standing', anchorId: 'standing' },
    nextSection: 'contact',
    title: 'Experience',
    body: 'I studied graphic design at university, which shaped my affinity for frontend development. Today, I work across frontend, backend, full-stack development, and architecture, depending on what the project needs.',
    experience: [
      {
        id: 'proxim-agency',
        role: 'Senior Full Stack Developer, Tech Lead & Solutions Architect',
        organization: 'Proxim Agency',
        period: { label: 'Dec 2023 – Present', startDate: '2023-12', endDate: null },
        description:
          'Building frontend and backend applications, from architecture and API design to deployment, while working directly with stakeholders.',
        technologies: ['Vue', 'TypeScript', 'Node.js', 'AWS'],
      },
      {
        id: 'bairesdev',
        role: 'Technical Lead',
        organization: 'BairesDev',
        period: { label: 'Apr 2021 – Dec 2023', startDate: '2021-04', endDate: '2023-12' },
        description:
          'Led an engineering team and frontend architecture for Vans Customizer, including its Vue 3 migration and enterprise integrations.',
        technologies: ['Vue', 'Three.js', 'Salesforce', 'SAP'],
      },
      {
        id: 'vans-e-customs',
        role: 'Senior Frontend Engineer',
        organization: 'Project Rauxa / Vans e-Customs',
        period: { label: 'Jan 2016 – Apr 2021', startDate: '2016-01', endDate: '2021-04' },
        description: 'Developed real-time 3D customization experiences and optimized rendering and product load times.',
        technologies: ['Three.js', 'WebGL', 'Vue', 'TypeScript'],
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    presentation: { cameraId: 'Contact', motionId: 'Recovery', anchorId: 'seated' },
    nextSection: null,
    title: 'Contact',
    body: 'Want to get in touch? LinkedIn is the best way to reach me.',
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/yormancastellanos/?locale=en_US' }],
  },
] as const satisfies readonly PortfolioSection[]

export const sectionById = {
  home: sections[0],
  bio: sections[1],
  projects: sections[2],
  experience: sections[3],
  contact: sections[4],
} satisfies Record<SectionId, (typeof sections)[number]>

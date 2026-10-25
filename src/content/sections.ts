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
        id: 'previous-portfolio-site',
        title: 'Previous portfolio site',
        description:
          "I built this site using threejs and vuejs. Animations are done with Tweenjs. The skateboarder ninja bunny models is from Sketchfab. I plan to replace it once I step up my Blender skills, mainly because I spent what it feels like 300 weeks trying to rig this model and animate the skeleton, a task a wiser man would have deemed foolish after seen the initial position of the skater Bunny. The skater's glb file originally was around 70mb, so trimming that down to a manageable file size was also fun (lol), I want to draco compress the glb eventually but I promised myseld I'd stop increasing the scope and eventually pushing this site out.",
        contribution: null,
        technologies: ['Three.js', 'Vue.js', 'Tween.js', 'Blender'],
        links: [
          {
            label: 'Original model on Sketchfab',
            href: 'https://sketchfab.com/3d-models/silent-ash-bc44272e8c1047148b33c913e659fcfa',
          },
        ],
      },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    presentation: { cameraId: 'Experience', motionId: 'Standing', anchorId: 'standing' },
    nextSection: 'contact',
    title: 'Experience',
    experience: [],
  },
  {
    id: 'contact',
    label: 'Contact',
    presentation: { cameraId: 'Contact', motionId: 'Recovery', anchorId: 'seated' },
    nextSection: null,
    title: 'Contact',
    body: 'I barely use LinkedIn these days but that is the best way to get in touch with me, because I will probably never put a form in this page, although it is on my to do list.',
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

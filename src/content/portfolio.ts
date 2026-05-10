import type { PortfolioSection, SceneConfig, SocialLink } from '@/definitions/portfolio';
import profileImage from '@/assets/img/profile.jpg';
import githubIcon from '@/assets/img/icons/iconmonstr-github-1.svg';
import linkedinIcon from '@/assets/img/icons/iconmonstr-linkedin-3.svg';

export const portfolioSections: PortfolioSection[] = [
  {
    name: 'case-study',
    title: 'Case Study',
    copy: 'Selected storefront and configurator work focused on performant 3D product experiences, maintainable frontend systems, and measurable commerce outcomes.'
  },
  {
    name: 'experience',
    title: 'Experience',
    copy: 'Frontend Technical Lead with a focus on Vue, Three.js, design systems, and production teams building rich customer-facing interfaces.'
  },
  {
    name: 'contact',
    title: 'Contact',
    copy: 'Available for frontend leadership, 3D web experiences, and commerce platform work. Reach out through GitHub or LinkedIn.'
  }
];

export const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/yormancast/three-d',
    imageSrc: profileImage,
    alt: 'profile'
  },
  {
    href: 'https://github.com/yormancast',
    imageSrc: githubIcon,
    alt: 'github profile',
    imageStyle: { backgroundColor: '#fff' }
  },
  {
    href: 'https://www.linkedin.com/in/yormancastellanos/?locale=en_US',
    imageSrc: linkedinIcon,
    alt: 'linkedin profile',
    imageStyle: { backgroundColor: '#fff' }
  }
];

export const portfolioSceneConfig: SceneConfig = {
  initialCameraPosition: {x: -6.5683258773040536, y: 1.2032376385239136, z: 5.055907184105575},
  model: {
    path: '/gltf/after_work-2.glb',
    scale: { x: 1.8, y: 0.7, z: 0.5 },
    position: { x: 0.7, y: -1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 }
  }
};

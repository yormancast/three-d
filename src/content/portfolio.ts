import type { PortfolioSection, SceneConfig, SocialLink } from '@/definitions/portfolio';
import profileImage from '@/assets/img/profile.jpg';
import githubIcon from '@/assets/img/icons/iconmonstr-github-1.svg';
import linkedinIcon from '@/assets/img/icons/iconmonstr-linkedin-3.svg';

export const portfolioSections: PortfolioSection[] = [
  {
    visible: false,
    name: 'bio',
    title: 'Bio',
    modelPosition: { x: -2.751, y: 0.2, z: 4 },
    sceneAnimation: 'bio',
    copy: "I'm a born Venezuelan living in Chile, and to this day I can never get a straight answer from my parents about where the hell my first name comes from. I found out early in my life that I like to build things and stay to stay inside most of my time, so I learnt to code. And I have been coding for more than a decade now. <br/><br/> I write mostly Javascript but I've dabbled in Python and C++ while failing at learning Unity lol. I'm technically a fullstack dev and I'm supposed to be working on my AWS certification, but here I am building things in threeJS because the frontend and the 3D world is where my passion lies, I'd rather stare at canvas' animations, material meshes and UV mappings all day instead of writing a stupid sql query that never ever ever does what I want."
  },
  {
    visible: false,
    name: 'about',
    title: 'About this site',
    modelPosition: { x: 2.751, y: -0.397, z: 3.8 },
    sceneAnimation: 'about',
    copy: "I built this site using threejs and vuejs. Animations are done with Tweenjs. The skateboarder ninja bunny models is from <a href='https://sketchfab.com/3d-models/silent-ash-bc44272e8c1047148b33c913e659fcfa' target='_blank'>Sketchfab</a>. I plan to replace it once I step up my Blender skills, mainly because I spent what it feels like 300 weeks trying to rig this model and animate the skeleton, a task a wiser man would have deemed foolish after seen the initial position of the skater Bunny. </br> The skater's glb file originally was around 70mb, so trimming that down to a manageable file size was also fun (lol), I want to draco compress the glb eventually but I promised myseld I'd stop increasing the scope and eventually pushing this site out."
  },
  {
    visible: false,
    name: 'contact',
    title: 'Contact',
    modelPosition: { x: 3, y: -4, z: 1 },
    sceneAnimation: 'contact',
    copy: "I barely use linkd in these days but that is the best way to get in touch with me, because I will probably never put a form in this page, although it is on my to do list. <br/> <a href='https://www.linkedin.com/in/yormancastellanos/?locale=en_US' target='_blank' style='font-size:1.3em;'>linkdin</a>"
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
  backgroundRotationStep: 0.01,
  initialCameraPosition: { x: 2.751, y: 0, z: 8 },
  model: {
    path: '/gltf/bunny.glb',
    rootNodeName: 'Bunny_2',
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  idleAnimation: {
    targetName: 'Bunny_2',
    position: {
      axis: 'y',
      distance: 0.12,
      duration: 2200
    },
    rotation: {
      axis: 'z',
      angle: 0.08,
      duration: 2800
    }
  },
  sectionAnimations: {
    bio: {
      steps: [
        {
          duration: 500,
          easing: 'quadraticInOut',
          targets: [
            {
              name: 'Bunny_2',
              rotation: { x: 0, y: 0.35, z: -0.08 }
            }
          ]
        },
        {
          duration: 650,
          easing: 'quadraticInOut',
          targets: [
            {
              name: 'Bunny_2',
              rotation: { x: 0, y: -0.15, z: 0.05 }
            }
          ]
        }
      ]
    },
    about: {
      steps: [
        {
          duration: 800,
          easing: 'quadraticInOut',
          targets: [
            {
              name: 'Bunny_2',
              rotation: { x: 0, y: 6.28, z: 0 }
            }
          ]
        }
      ]
    },
    contact: {
      steps: [
        {
          duration: 450,
          easing: 'quadraticInOut',
          targets: [
            {
              name: 'Bunny_2',
              position: { x: 0, y: 0.2, z: 0 },
              rotation: { x: -0.1, y: 0.18, z: 0.1 }
            }
          ]
        },
        {
          duration: 650,
          easing: 'quadraticInOut',
          targets: [
            {
              name: 'Bunny_2',
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 }
            }
          ]
        }
      ]
    }
  },
  resizeRatio: 0.08
};

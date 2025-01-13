export const languages = {
  en: "English",
  es: "Español",
}

export const defaultLang = "en";

interface Text {
  role: string;
  about: string;
  experience: string;
  hOne: string;
  hTwo: string;
  hThree: string;
  hFour: string;
  hFive: string;
  hSix: string;
  pOne: string;
  pTwo: string;
  pFinished: string;
  pInProgress: string;
}

export const ui: Record<string, Text> = {
  en: {
    role: "Software Engineer",
    about: "Hello! I’m a freelance software engineer with a passion for creating innovative technological solutions. I like to define myself as an assertive, patient person with knowledge in various areas.",
    experience: "With over 2 years of experience in the industry, I have worked on a wide range of projects that have allowed me to develop strong skills in designing, developing, and delivering high-quality software.",
    hOne: "About Me",
    hTwo: "Skills",
    hThree: "Works",
    hFour: "Projects",
    hFive: "Articles",
    hSix: "Contacts",
    pOne: "Tools",
    pTwo: "Deploy",
    pFinished: "Finished",
    pInProgress: "In Progress",
  },
  es: {
    role: "Ingeniero de Software",
    about: "¡Hola! Soy un ingeniero de software freelance con una pasión por la creación de soluciones tecnológicas innovadoras. Me gusta definirme como una persona asertiva, paciente y con conocimiento sobre diversos temas.",
    experience: "Con más de 2 años de experiencia en la industria, he trabajado en una amplia gama de proyectos que me han permitido desarrollar habilidades sólidas en el diseño, desarrollo y entrega de software de alta calidad.",
    hOne: "Acerca de mí",
    hTwo: "Habilidades",
    hThree: "Trabajos",
    hFour: "Proyectos",
    hFive: "Artículos",
    hSix: "Contactos",
    pOne: "Herramientas",
    pTwo: "Despliegue",
    pFinished: "Finished",
    pInProgress: "En Progreso",
  }
} as const;


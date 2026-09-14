export interface Template {
  link: string;
  title: string;
  status: number;
}

// 1 == Terminado
// 0 == En Progreso
export const works: Template[] = [
  {
    link: "https://neo-devs-hero-ai.vercel.app/",
    title: "HeroAI",
    status: 1,
  },
  {
    link: "https://fanaweb.vercel.app/",
    title: "FANA Automotriz",
    status: 1,
  },
  {
    link: "https://service-entretien-sjs.vercel.app/",
    title: "SJS | Entretien Service",
    status: 1,
  },
  {
    link: "http://18.220.232.202:3000/",
    title: "GeoShake",
    status: 0,
  },
];

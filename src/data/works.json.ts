export interface Template {
  link: string;
  title: string;
  status: string;
}
const one: Template = {
  link: "https://lalaeventplanner.com/",
  title: "Lala Event Planner",
  status: "En Progreso",
};
const two: Template = {
  link: "/",
  title: "FANA Automotriz",
  status: "En Progreso",
};
const three: Template = {
  link: "https://service-entretien-sjs.vercel.app/",
  title: "SJS | Entretien Service",
  status: "Terminado",
};
const four: Template = {
  link: "https://loweffort-alt.github.io/web-accel/",
  title: "Android | QuakeSense",
  status: "Terminado",
};
export const bytitle = {
  one,
  two,
  three,
  four,
};
export const works = Object.values(bytitle);

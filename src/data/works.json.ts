export interface Template {
  link: string;
  title: string;
  status: string;
}
const one: Template = {
  link: "https://lalaeventplanner.com/",
  title: "Lala Event Planner",
  status: "Terminado",
};
const two: Template = {
  link: "https://fanaweb.vercel.app/",
  title: "FANA Automotriz",
  status: "Terminado",
};
const three: Template = {
  link: "https://service-entretien-sjs.vercel.app/",
  title: "SJS | Entretien Service",
  status: "Terminado",
};
const four: Template = {
  link: "https://loweffort-alt.github.io/web-accel/",
  title: "Android | QuakeSense",
  status: "En Proceso",
};
export const bytitle = {
  one,
  two,
  three,
  four,
};
export const works = Object.values(bytitle);

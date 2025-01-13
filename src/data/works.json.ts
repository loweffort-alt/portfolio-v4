export interface Template {
  link: string;
  title: string;
  status: number;
}

// 1 == Terminado
// 0 == En Progreso
const one: Template = {
  link: "https://lalaeventplanner.com/",
  title: "Lala Event Planner",
  status: 1,
};
const two: Template = {
  link: "https://fanaweb.vercel.app/",
  title: "FANA Automotriz",
  status: 1,
};
const three: Template = {
  link: "https://service-entretien-sjs.vercel.app/",
  title: "SJS | Entretien Service",
  status: 1,
};
const four: Template = {
  link: "https://loweffort-alt.github.io/web-accel/",
  title: "Android | QuakeSense",
  status: 0,
};
export const bytitle = {
  one,
  two,
  three,
  four,
};
export const works = Object.values(bytitle);

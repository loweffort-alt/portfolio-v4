export interface Template {
  link: string;
  type: string;
  title: string;
}
const one: Template = {
  link: "https://github.com/loweffort-alt",
  type: "Github",
  title: "loweffort-alt",
};
const three: Template = {
  link: "mailto:farfan_alexander@outlook.com",
  type: "Email",
  title: "farfan_alexander@outlook.com",
};
const four: Template = {
  link: "/CV-AlexFarfan.pdf",
  type: "CV",
  title: "Curriculum Vitae",
};
const five: Template = {
  link: "https://www.linkedin.com/in/alexfarfan/",
  type: "LinkedIn",
  title: "alexfarfan",
};
export const bytype = {
  five,
  one,
  four,
  three,
};
export const contact = Object.values(bytype);

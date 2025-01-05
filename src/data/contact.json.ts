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
const two: Template = {
  link: "https://loweffort.notion.site/Bienvenido-emprendedor-b6e0e8635bfd412bab98cb731372e3d9",
  type: "Freelance",
  title: "¡Dale Vida a tu Presencia en la Web!",
};
const three: Template = {
  link: "mailto:farfan_alexander@outlook.com",
  type: "Email",
  title: "farfan_alexander@outlook.com",
};
const four: Template = {
  link: "https://drive.google.com/file/d/1xTSWrMKQZemCGhtFT4ba5vvw1T90qNZ-/view?usp=sharing",
  type: "CV",
  title: "Darío Alexander Farfán Navarro",
};
const five: Template = {
  link: "https://www.linkedin.com/in/alexfarfan/",
  type: "LinkedIn",
  title: "alexfarfan",
};
export const bytype = {
  one,
  two,
  three,
  five,
  four,
};
export const contact = Object.values(bytype);

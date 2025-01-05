export interface Template {
  link: string;
  title: string;
  date: string;
}
const one: Template = {
  link: "https://loweffort.notion.site/Introducci-n-a-NodeJS-06f3552c1bde4fbdbf5ca1301bc8d747?pvs=4",
  title: "Introducción a NodeJS",
  date: "13.02.2023",
};
const two: Template = {
  link: "https://loweffort.notion.site/NodeJS-01-b3bf324784cf4618b32c6199ce24bf34?pvs=4",
  title: "NodeJS 01",
  date: "10.02.2022",
};
const three: Template = {
  link: "https://loweffort.notion.site/Docker-Basics-8ca86e7064884b3cb648f217fb11a91f?pvs=4",
  title: "Docker Basics",
  date: "10.02.2022",
};
const four: Template = {
  link: "https://loweffort.notion.site/Lua-decf6c31e65d45c69929a95f327214e2",
  title: "Lua",
  date: "03.03.2024",
};
const five: Template = {
  link: "https://loweffort.notion.site/Advance-ReadMe-ed082419606e445b83f60d1466368dae?pvs=4",
  title: "Neovim 2023 Setup",
  date: "03.02.2023",
};
export const bytitle = {
  one,
  two,
  three,
  four,
  five,
};
export const articles = Object.values(bytitle);

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
  link: "https://media.licdn.com/dms/document/media/v2/D4E2DAQEHrxSeykE8VA/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1736757150004?e=1737590400&v=beta&t=5aYwMNB5fMuVXW5-ITkx7rBPje0rwAMsXGmS9eI7BdI",
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

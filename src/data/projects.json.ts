export interface Template {
  link: {
    Github: string;
    Doc: string;
    Figma?: string;
    AndroidRepo?: string;
    Server?: string;
    Cliente?: string;
  };
  title: string;
  state: string;
}
const one: Template = {
  link: {
    Github: "https://github.com/loweffort-alt/ToDoLock-server",
    Doc: "/",
    Figma:
      "https://www.figma.com/community/file/1275291490973723744/rest-api-diagram-eng-esp",
    Cliente: "https://loweffort-alt.github.io/ToDoLock-client/",
  },
  title: "ToDoLock: Gestión de Tareas con Sesiones de Usuario",
  state: "Terminado",
};
const two: Template = {
  link: {
    Github: "https://github.com/loweffort-alt/check-in_simulator",
    Doc: "https://loweffort.notion.site/Airport-API-Documentation-3588c8a12db64b8dbd725a7b7b65a6c7",
    Server: "https://check-in-simulator-f7j8.onrender.com/flights/1/passengers",
    Cliente: "/",
  },
  title: "Check-In Virtual: ¡Listos para Despegar!",
  state: "En progreso",
};
const three: Template = {
  link: {
    Github: "https://github.com/loweffort-alt/web-accel",
    Doc: "/",
    Server: "https://server-acce.onrender.com/proxy",
    Cliente: "https://loweffort-alt.github.io/web-accel/",
  },
  title: "QuakeSense: Centro de Monitoreo de Estaciones Sísmicas",
  state: "En progreso",
};

export const bytitle = {
  one,
  two,
  three,
};
export const projects = Object.values(bytitle);


export type Character = "tanit" | "bess";

export const characterDetails = {
  tanit: {
    name: "Tanit",
    description: "Diosa fenicia de Ibiza, amante de la naturaleza, el mar y el bienestar.",
    greeting: "¡Hola! Soy Tanit 🌊, la diosa de Ibiza. Mi especialidad es la belleza natural de la isla, la tranquilidad del mar y los espacios para el bienestar. ¿En qué puedo ayudarte en tu visita a nuestra hermosa isla?",
    background: "from-tanit-secondary via-[#33C3F0] to-tanit-highlight",
    messageBackground: "bg-black/20",
    userMessageBackground: "bg-tanit-primary",
    icons: ["sun", "palmtree", "waves", "leaf"],
  },
  bess: {
    name: "Bess",
    description: "Dios egipcio de la música y la fiesta, amante del hedonismo y la vida nocturna.",
    greeting: "¡Hey! Soy Bess 🔥, el dios de la fiesta. Conozco todos los clubes, fiestas y la mejor vida nocturna de Ibiza. ¿Listo para vivir experiencias increíbles? ¡Pregúntame lo que quieras!",
    background: "from-bess-primary via-bess-secondary to-bess-accent",
    messageBackground: "bg-black/50",
    userMessageBackground: "bg-bess-primary",
    icons: ["music", "flame", "sparkles", "party-popper"],
  },
};

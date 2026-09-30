export const COLORS = {
  violet: "#8B3FFB",
  magenta: "#FF2E9A",
  cyan: "#2FE0D6",
  orange: "#FF7A29",
} as const;

const g = (a: string, b: string) => `linear-gradient(120deg, ${a}, ${b})`;

export const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;

/** Montant en FCFA, format français : 1 680 000 FCFA */
export const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n).replace(/[\u202f\u00a0]/g, " ") + " FCFA";

export type Cagnotte = {
  id: string;
  title: string;
  cat: string;
  goal: number;
  raised: number;
  supporters: number;
  days: number;
  org: string;
  image: string;
  gradient: string;
};

export type EventItem = {
  id: string;
  title: string;
  place: string;
  date: string;
  time: string;
  price: number;
  cat: string;
  left: number;
  image: string;
  gradient: string;
};

export type MyTicket = {
  id: string;
  title: string;
  date: string;
  place: string;
  code: string;
  seat: string;
};

// Données de démonstration — seront remplacées par Supabase.
export const CAGNOTTES: Cagnotte[] = [
  { id: "c1", title: "Opération Toit pour Aïcha", cat: "Solidarité", goal: 2500000, raised: 1680000, supporters: 214, days: 12, org: "Famille Kouassi", image: IMG("photo-1741615331533-2360157c55aa"), gradient: g(COLORS.violet, COLORS.magenta) },
  { id: "c2", title: "Tournée Basketball Quartier Zongo", cat: "Sport", goal: 900000, raised: 610000, supporters: 88, days: 5, org: "Club ZBC", image: IMG("photo-1616402455550-9b3856740f21"), gradient: g(COLORS.cyan, COLORS.violet) },
  { id: "c3", title: "Studio d’enregistrement mobile", cat: "Créativité", goal: 1500000, raised: 340000, supporters: 41, days: 21, org: "Collectif Wax", image: IMG("photo-1642177272498-98096a6c98e4"), gradient: g(COLORS.orange, COLORS.magenta) },
];

export const EVENTS: EventItem[] = [
  { id: "e1", title: "Nuit Graffiti & Bass", place: "Hangar 12, Cotonou", date: "Sam. 09 Août", time: "22:00", price: 5000, cat: "Concert", left: 128, image: IMG("photo-1750186649523-cff3329a6e76"), gradient: g(COLORS.magenta, COLORS.violet) },
  { id: "e2", title: "Battle de Danse Urbaine", place: "Palais des Sports, Cotonou", date: "Dim. 17 Août", time: "16:00", price: 3000, cat: "Battle", left: 340, image: IMG("photo-1765098139127-5fa14432dd8a"), gradient: g(COLORS.cyan, COLORS.orange) },
  { id: "e3", title: "Marché des Créateurs 229", place: "Place de l’Amazone", date: "Ven. 22 Août", time: "10:00", price: 1000, cat: "Marché", left: 612, image: IMG("photo-1734255026082-82fdc81991f0"), gradient: g(COLORS.orange, COLORS.magenta) },
];

export const MY_TICKETS: MyTicket[] = [
  { id: "t1", title: "Nuit Graffiti & Bass", date: "09 Août · 22:00", place: "Hangar 12, Cotonou", code: "RLY-8827-XQ21", seat: "Accès général" },
];

export const getCagnotte = (id: string) => CAGNOTTES.find((c) => c.id === id);
export const getEvent = (id: string) => EVENTS.find((e) => e.id === id);

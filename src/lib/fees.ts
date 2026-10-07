/**
 * Frais Rallyo : SOURCE UNIQUE (simulateur, page Tarifs, FAQ, futur paiement).
 *
 * MODÈLE (décision du porteur, 2026-10-03), identique pour les cagnottes et la billetterie :
 *
 *     frais total = 5 % (Rallyo) + pourcentage du prestataire de paiement (FedaPay) selon le moyen de paiement
 *
 * Rien d'autre : ni frais d'inscription, ni abonnement, ni paliers. Ce modèle REMPLACE l'ancienne grille
 * progressive de 10 % à 3 %.
 *
 * HYPOTHÈSE à confirmer : le total est DÉDUIT des recettes de l'organisateur (décision du 2026-10-02) et
 * n'est jamais ajouté au prix payé par l'acheteur.
 *
 * Pourcentages FedaPay : tarifs publiés sur fedapay.com, relevés le 2026-10-03, À RECONFIRMER avant le lancement
 * (la page semblait datée). Tarif des cartes bancaires : non trouvé, donc non proposé ici.
 * Non inclus : les frais fixes de versement FedaPay (150 à 2 500 F par virement vers Mobile Money), cf. CDC §20.2.
 *
 * Pour changer un taux, il suffit de modifier ce fichier.
 */

/** Part de Rallyo, en %. */
export const RALLYO_RATE = 5;

export type ProviderMethod = { id: string; label: string; rate: number };

/** Moyens de paiement FedaPay et pourcentage prélevé par FedaPay, en %. */
export const PROVIDER_METHODS: ProviderMethod[] = [
  { id: "mobile-benin", label: "Mobile Money Bénin : MTN, Moov, Celtiis", rate: 1.8 },
  { id: "mobile-plus", label: "Coris Money, BMO (Bénin) · MTN Côte d’Ivoire", rate: 4 },
];

export const DEFAULT_METHOD: ProviderMethod = PROVIDER_METHODS[0];

const providerRates = PROVIDER_METHODS.map((m) => m.rate);
/** Total le plus bas et le plus haut selon le moyen de paiement (Rallyo + FedaPay), en %. */
export const TOTAL_RATE_MIN = RALLYO_RATE + Math.min(...providerRates);
export const TOTAL_RATE_MAX = RALLYO_RATE + Math.max(...providerRates);

/** Formate un taux à la française : 6,8 · 5 · 9. */
export function fmtRate(rate: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(rate);
}

export type FeeBreakdown = {
  amount: number;
  rallyoRate: number;
  providerRate: number;
  rallyoFee: number;
  providerFee: number;
  /** Total prélevé (Rallyo + prestataire). */
  fee: number;
  /** Ce que reçoit l'organisateur. */
  net: number;
  totalRate: number;
};

/** Pourcentage d'un montant, arrondi au franc : calcul en dixièmes de % pour éviter les erreurs de virgule flottante. */
const pct = (amount: number, rate: number) => Math.round((amount * Math.round(rate * 10)) / 1000);

export function computeFee(amount: number, providerRate: number = DEFAULT_METHOD.rate): FeeBreakdown {
  const a = Math.max(0, Math.floor(Number.isFinite(amount) ? amount : 0));
  const rallyoFee = pct(a, RALLYO_RATE);
  const providerFee = pct(a, providerRate);
  const fee = rallyoFee + providerFee;
  return {
    amount: a,
    rallyoRate: RALLYO_RATE,
    providerRate,
    rallyoFee,
    providerFee,
    fee,
    net: a - fee,
    totalRate: RALLYO_RATE + providerRate,
  };
}

/**
 * @deprecated Anciens noms de l'ex-grille progressive, conservés UNIQUEMENT pour que `src/lib/site-data.ts`
 * (verrouillé par l'autre IA au moment de ce changement) continue de compiler. À supprimer dès que ses lignes
 * « Cagnotte », « Billetterie » et les questions « Combien coûte Rallyo ? » / « Qui paie les frais de Rallyo ? »
 * sont réécrites avec RALLYO_RATE, TOTAL_RATE_MIN et TOTAL_RATE_MAX. Voir JOURNAL du 2026-10-03.
 */
export const FEE_MAX_RATE = TOTAL_RATE_MAX;
/** @deprecated voir FEE_MAX_RATE. */
export const FEE_MIN_RATE = TOTAL_RATE_MIN;

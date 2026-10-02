/**
 * Grille de commission Rallyo — source unique de vérité.
 * Utilisée par le simulateur et la page Tarifs, et à réutiliser côté serveur pour le calcul réel.
 *
 * Fonctionnement : tranches PROGRESSIVES (comme l'impôt). Chaque tranche du montant est facturée
 * à son propre taux, donc la commission ne diminue jamais quand le montant augmente.
 * Taux fixés par le porteur du projet : de 10 % (premières tranches) à 3 % (grosses collectes).
 * ⚠️ Les taux intermédiaires (8 / 6 / 4 %) et les seuils sont à valider.
 */

export type FeeTier = {
  /** Borne haute de la tranche en FCFA (incluse). `null` = sans limite. */
  upTo: number | null;
  /** Taux appliqué à la part du montant située dans cette tranche, en %. */
  rate: number;
};

export const FEE_TIERS: readonly FeeTier[] = [
  { upTo: 100_000, rate: 10 },
  { upTo: 500_000, rate: 8 },
  { upTo: 1_000_000, rate: 6 },
  { upTo: 2_500_000, rate: 4 },
  { upTo: null, rate: 3 },
];

export type FeeSlice = {
  /** Début de la tranche (exclu) et fin (incluse) du morceau réellement concerné. */
  from: number;
  to: number;
  rate: number;
  /** Part du montant dans cette tranche, en FCFA. */
  amount: number;
  /** Commission sur cette part, en FCFA (non arrondie). */
  fee: number;
};

export type FeeResult = {
  amount: number;
  /** Commission totale, arrondie au FCFA. */
  fee: number;
  /** Montant reçu par l'organisateur (hors frais du prestataire Mobile Money). */
  net: number;
  /** Taux moyen réellement payé, en % (ex. 4.14). */
  effectiveRate: number;
  slices: FeeSlice[];
};

/** Calcule la commission Rallyo pour un montant collecté (ou des ventes de billets) en FCFA. */
export function computeFee(rawAmount: number): FeeResult {
  const amount = Number.isFinite(rawAmount) ? Math.max(0, Math.floor(rawAmount)) : 0;
  const slices: FeeSlice[] = [];
  let lower = 0;

  for (const tier of FEE_TIERS) {
    if (amount <= lower) break;
    const upper = tier.upTo === null ? amount : Math.min(amount, tier.upTo);
    const part = upper - lower;
    if (part > 0) {
      slices.push({ from: lower, to: upper, rate: tier.rate, amount: part, fee: (part * tier.rate) / 100 });
    }
    if (tier.upTo === null || amount <= tier.upTo) break;
    lower = tier.upTo;
  }

  const fee = Math.round(slices.reduce((sum, s) => sum + s.fee, 0));
  return {
    amount,
    fee,
    net: amount - fee,
    effectiveRate: amount === 0 ? FEE_TIERS[0].rate : (fee / amount) * 100,
    slices,
  };
}

/** Libellé lisible d'une tranche, ex. « De 100 001 à 500 000 FCFA » ou « Au-delà de 2 500 000 FCFA ». */
export function tierLabel(index: number): string {
  const nf = new Intl.NumberFormat("fr-FR");
  const fmtN = (n: number) => nf.format(n).replace(/[\u202f\u00a0]/g, " ");
  const tier = FEE_TIERS[index];
  const prev = index === 0 ? 0 : (FEE_TIERS[index - 1].upTo as number);
  if (index === 0) return `Jusqu’à ${fmtN(tier.upTo as number)} FCFA`;
  if (tier.upTo === null) return `Au-delà de ${fmtN(prev)} FCFA`;
  return `De ${fmtN(prev + 1)} à ${fmtN(tier.upTo)} FCFA`;
}

/** Taux d'entrée et plancher, pour les textes (« de 10 % à 3 % »). */
export const FEE_MAX_RATE = FEE_TIERS[0].rate;
export const FEE_MIN_RATE = FEE_TIERS[FEE_TIERS.length - 1].rate;

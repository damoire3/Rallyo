/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SiteIcon } from "./site-icon";
import { Check } from "lucide-react";
import { PhoneDemo } from "./phone-demo";
import { Stat, TiltCard } from "./interactive";
import { FaqItems } from "./blocks";
import { ScribbleUnderline, Scene, Sticker, SprayBlob } from "./decor";
import { ShowcaseStrip } from "./showcase";
import { getShowcaseItems } from "@/lib/showcase";
import { CAGNOTTES, EVENTS, fmt } from "@/lib/data";
import {
  CASES, FAQ_FLAT, IMAGES, MARQUEE, PRICING, STATS, STEPS_PIN, TRUST_CARDS, WHY_CARDS,
} from "@/lib/site-data";

/** Pop-ups flottants du hero (téléphone « évènement » + carte « cagnotte »). Données d'exemple, identiques à l'appli de démo. */
function HeroPopups() {
  const ev = EVENTS[0];
  const ca = CAGNOTTES[0];
  const pct = Math.round((ca.raised / ca.goal) * 100);
  return (
    <div className="hero-popups" aria-hidden>
      <div className="pop-phone">
        <div className="pop-screen">
          <div
            className="pop-cover"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(139,63,251,.85), rgba(255,46,154,.7)), url('${ev.image}')` }}
          >
            <span className="pop-chip">{ev.cat.toUpperCase()}</span>
          </div>
          <div className="pop-body">
            <p className="pop-title">{ev.title}</p>
            <p className="pop-sub">{ev.place} · {ev.time}</p>
            <div className="show-dash" />
            <div className="pop-row">
              <span>{ev.left} billets restants</span>
              <b>{fmt(ev.price)}</b>
            </div>
          </div>
        </div>
      </div>
      <div className="pop-card">
        <p className="pop-card-title">Cagnotte · {ca.org}</p>
        <div className="show-bar"><i style={{ width: `${pct}%` }} /></div>
        <b>{pct}%</b>
      </div>
      <span className="pop-note">Exemple</span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-layer l1" style={{ backgroundImage: `url('${IMAGES.heroL1}')` }} />
      <div className="hero-layer l2" style={{ backgroundImage: `url('${IMAGES.heroL2}')` }} />
      <div className="hero-grad" />
      <Sticker text="0 FCFA à l’inscription" className="pink" style={{ top: "17%", right: "5%", transform: "rotate(8deg)", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }} />
      <Sticker text="Mobile Money" className="cyan" style={{ bottom: "13%", left: "47%", transform: "rotate(-9deg)" }} />
      <div className="hero-content hero-split">
        <div className="hero-text">
          <div className="hero-eyebrow">Rassemble. Célèbre. Soutiens.</div>
          <h1>
            UN SEUL GESTE
            <br />
            POUR <span className="line2">RASSEMBLER</span>
            <br />
            TA COMMUNAUTÉ
          </h1>
          <p className="sub">
            Cagnottes solidaires et billetterie d’évènements, pensées pour l’Afrique de l’Ouest. Mobile Money intégré, paiement en
            quelques minutes, un lien prêt à partager sur WhatsApp.
          </p>
          <div className="hero-actions">
            <Link href="/app/creer" className="btn-big">Lancer une cagnotte</Link>
            <Link href="/comment-ca-marche" className="btn-outline">Comment ça marche</Link>
          </div>
          <div className="hero-checks">
            <span><Check size={15} strokeWidth={2.5} aria-hidden /> 0 FCFA à l’inscription</span>
            <span><Check size={15} strokeWidth={2.5} aria-hidden /> Dons anonymes possibles</span>
            <span><Check size={15} strokeWidth={2.5} aria-hidden /> Installable comme une app</span>
          </div>
        </div>
        <HeroPopups />
      </div>

      <div className="scroll-hint" aria-hidden>
        scroll<div className="bar" />
      </div>
    </section>
  );
}

export function MarqueeBand() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="marquee-wrap" aria-hidden>
      <div className="marquee">
        <div className="marquee-track">
          {[...items, ...items].map((t, i) => (
            <span key={i}>{t} ✦</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Wall() {
  return (
    <Scene id="mur" bg={IMAGES.murBg} tint="pink">
      <SprayBlob color="var(--pink)" size={320} style={{ top: -60, left: -80 }} />
      <div className="eyebrow">{"// Ce que tu peux faire"}</div>
      <h2 className="section-title" data-reveal="">
        Un mur, <ScribbleUnderline><span className="graffiti">trois façons</span></ScribbleUnderline>
        <br />
        de rassembler.
      </h2>
      <p className="lede" data-reveal="">
        Mariage, deuil, projet ou concert : Rallyo s’adapte à ton besoin.
      </p>

      <div className="wall">
        <div className="wall-item" style={{ width: "26%", height: 260, top: 0, left: 0 }} data-reveal="">
          <img src={IMAGES.murPortraitSmile} alt="Portrait souriant" loading="lazy" />
        </div>
        <TiltCard className="wall-card" style={{ width: "30%", top: 40, left: "29%" }}>
          <div className="tape" />
          <div className="num">01</div>
          <h3 style={{ color: "var(--pink)" }}>Cagnotte solidaire</h3>
          <p>Soutiens un proche, finance un projet ou réponds à une urgence, avec une jauge visible par tous.</p>
        </TiltCard>
        <div className="wall-item" style={{ width: "22%", height: 300, top: 10, right: 0 }} data-reveal="">
          <img src={IMAGES.murConcertLights} alt="Concert et lumières" loading="lazy" />
        </div>

        <TiltCard className="wall-card" style={{ width: "26%", top: 340, left: 0 }}>
          <div className="num">02</div>
          <h3 style={{ color: "var(--cyan)" }}>Billetterie évènement</h3>
          <p>Vends tes billets en ligne. Mobile Money intégré, e-billets QR et contrôle d’accès simple.</p>
        </TiltCard>
        <div className="wall-item" style={{ width: "24%", height: 320, top: 300, left: "28%" }} data-reveal="">
          <img src={IMAGES.murStreetArt} alt="Street art" loading="lazy" />
        </div>
        <div className="wall-item" style={{ width: "26%", height: 230, top: 360, left: "54%" }} data-reveal="">
          <img src={IMAGES.murFestivalDance} alt="Festival et danse" loading="lazy" />
        </div>
        <TiltCard className="wall-card" style={{ width: "20%", top: 330, right: 0 }}>
          <div className="tape" />
          <div className="num">03</div>
          <h3 style={{ color: "var(--acid)" }}>Don anonyme</h3>
          <p>Certains veulent donner sans être vus. Rallyo protège ta discrétion.</p>
        </TiltCard>

        <div className="wall-item" style={{ width: "34%", height: 240, top: 660, left: "6%" }} data-reveal="">
          <img src={IMAGES.murMarketColor} alt="Marché coloré" loading="lazy" />
        </div>
        <div className="wall-item" style={{ width: "24%", height: 240, top: 680, left: "44%" }} data-reveal="">
          <img src={IMAGES.murGraffitiColorful} alt="Graffiti coloré" loading="lazy" />
        </div>
        <div className="wall-item" style={{ width: "20%", height: 220, top: 660, right: "2%" }} data-reveal="">
          <img src={IMAGES.murHandsRaised} alt="Mains levées en célébration" loading="lazy" />
        </div>
      </div>
    </Scene>
  );
}

export function DemoSection() {
  return (
    <section className="block alt" id="demo">
      <div className="container">
        <div className="block-head">
          <div className="eyebrow">{"// Essaie sans compte"}</div>
          <h2 className="section-title" data-reveal="">
            L’appli, <span className="graffiti">dans ta poche.</span>
          </h2>
          <p className="lede" data-reveal="">
            Pas besoin de te croire sur parole : navigue dans l’appli Rallyo juste ici, comme sur ton téléphone.
          </p>
        </div>
        <PhoneDemo />
      </div>
    </section>
  );
}

export function Why() {
  return (
    <Scene id="pourquoi" bg={IMAGES.pourquoiBg} tint="cyan">
      <div className="eyebrow">{"// Pourquoi Rallyo"}</div>
      <h2 className="section-title" data-reveal="">
        Fait pour <span className="graffiti">chez nous.</span>
      </h2>
      <div className="why-grid">
        {WHY_CARDS.map((c) => (
          <div className="why-card" key={c.title} data-reveal="">
            <div className="icon"><SiteIcon name={c.icon} /></div>
            <h4>{c.title}</h4>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <Link href="/pourquoi-rallyo" className="more-link">Tout comprendre →</Link>
    </Scene>
  );
}

export function ImpactBand() {
  return (
    <section className="impact-band" aria-label="Rallyo en chiffres">
      <div className="impact-grid">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

export function StepsPin() {
  return (
    <section className="pin-section" id="etapes" aria-label="Comment ça marche en 4 étapes">
      <div className="pin-track" id="pinTrack">
        {STEPS_PIN.map((s, i) => (
          <div className="pin-panel" key={s.n}>
            <div className="bg" style={{ backgroundImage: `url('${s.bg}')` }} />
            <div className="content">
              <div className="stepnum">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
              {i === STEPS_PIN.length - 1 && (
                <Link href="/comment-ca-marche" className="more-link">Voir le détail des parcours →</Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="pin-progress" aria-hidden>
        <div className="pin-progress-bar" id="pinBar" />
      </div>
    </section>
  );
}

export function Cases() {
  return (
    <Scene id="usages" bg={IMAGES.casBg} tint="violet">
      <div className="eyebrow">{"// Ils pourraient être toi"}</div>
      <h2 className="section-title" data-reveal="">
        Des histoires <span className="graffiti">qui nous ressemblent.</span>
      </h2>
      <div className="case-grid">
        {CASES.map((c) => (
          <article className="case-card" key={c.title} data-reveal="">
            <img src={c.image} alt="" loading="lazy" />
            <div className="case-body">
              <div className="case-label">{c.label}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="case-note">Scénarios illustratifs, imaginés à partir des usages que Rallyo vise.</p>
    </Scene>
  );
}

/**
 * Défilé « Ça se passe chez nous ». Composant serveur asynchrone :
 * évènements/cagnottes populaires du back (13 max), sinon photos d'illustration — voir src/lib/showcase.ts.
 */
export async function GalleryStrip() {
  const { items, live } = await getShowcaseItems();
  return (
    <Scene id="galerie" bg={IMAGES.galerieBg} tint="orange">
      <div className="eyebrow">{"// L’énergie qu’on veut servir"}</div>
      <h2 className="section-title" data-reveal="">
        Ça se passe <span className="graffiti">chez nous.</span>
      </h2>
      <p className="lede" data-reveal="">
        {live > 0
          ? "Les évènements et cagnottes qui bougent le plus en ce moment sur Rallyo."
          : "Bientôt ici : les évènements et cagnottes qui bougent le plus sur Rallyo. Lance la première !"}
      </p>
      <ShowcaseStrip items={items} />
    </Scene>
  );
}

export function TrustStrip() {
  return (
    <section className="block alt" id="confiance">
      <div className="container">
        <div className="block-head">
          <div className="eyebrow">{"// Confiance"}</div>
          <h2 className="section-title" data-reveal="">
            Ton argent, <span className="graffiti">protégé.</span>
          </h2>
          <p className="lede" data-reveal="">Des règles simples et visibles, pour ceux qui donnent comme pour ceux qui collectent.</p>
        </div>
        <div className="trust-grid">
          {TRUST_CARDS.slice(0, 3).map((c) => (
            <div className="trust-card" key={c.title} data-reveal="">
              <div className="icon"><SiteIcon name={c.icon} /></div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
        <Link href="/securite" className="more-link">Sécurité et paiements en détail →</Link>
      </div>
    </section>
  );
}

export function PricingTeaser() {
  return (
    <Scene id="tarifs" bg={IMAGES.pricingBg} tint="acid">
      <div className="eyebrow">{"// Tarifs"}</div>
      <h2 className="section-title" data-reveal="">
        Simple et <span className="graffiti">transparent.</span>
      </h2>
      <p className="lede" data-reveal="">Gratuit pour commencer : tu ne paies une commission que lorsque tu collectes.</p>
      <div className="price-grid">
        {PRICING.map((c) => (
          <div className={`price-card ${c.highlight ? "highlight" : ""} ${c.soon ? "soon" : ""}`} key={c.label} data-reveal="">
            <div className="tag-label">{c.label}{c.soon && <span className="badge-soon">BIENTÔT</span>}</div>
            <div className="amount">{c.amount}<small> {c.small}</small></div>
            <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
      <Link href="/tarifs" className="more-link">Simuler mes frais →</Link>
    </Scene>
  );
}

export function FaqTeaser() {
  return (
    <section className="block" id="faq">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="block-head">
          <div className="eyebrow">{"// Questions fréquentes"}</div>
          <h2 className="section-title" data-reveal="">
            On te <span className="graffiti">répond.</span>
          </h2>
        </div>
        <FaqItems items={FAQ_FLAT.slice(0, 5)} />
        <Link href="/faq" className="more-link">Toutes les questions →</Link>
      </div>
    </section>
  );
}

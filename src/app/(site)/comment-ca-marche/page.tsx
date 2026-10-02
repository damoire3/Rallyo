import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { IMAGES, FLOW_CAGNOTTE, FLOW_DONOR, FLOW_EVENT } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Crée une cagnotte ou une billetterie en quelques minutes : les étapes détaillées pour les organisateurs et pour ceux qui contribuent.",
  alternates: { canonical: "/comment-ca-marche" },
};

type Step = { title: string; text: string };

function Flow({ title, sub, steps, className = "" }: { title: string; sub: string; steps: Step[]; className?: string }) {
  return (
    <section className={`flow ${className}`.trim()} data-reveal="">
      <h3>{title}</h3>
      <p className="flow-sub">{sub}</p>
      {className.includes("donor") ? (
        <div className="donor-steps">
          {steps.map((s, i) => (
            <div className="flow-step" key={s.title} style={{ borderTop: 0 }}>
              <div className="flow-num">{i + 1}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        steps.map((s, i) => (
          <div className="flow-step" key={s.title}>
            <div className="flow-num">{i + 1}</div>
            <div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Comment ça marche"
        title={<>Du lien au <span className="graffiti">paiement</span>, en clair.</>}
        lede="Que tu lances une cagnotte, vendes des billets ou veuilles simplement soutenir quelqu’un, voici exactement ce qui se passe, étape par étape."
        bg={IMAGES.step2Bg}
        tint="violet"
        actions={
          <>
            <Link href="/app/creer" className="btn-big">Commencer maintenant</Link>
            <Link href="/faq" className="btn-outline">Une question ?</Link>
          </>
        }
      />

      <section className="block">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Pour les organisateurs"}</div>
            <h2 className="section-title" data-reveal="">
              Deux parcours, <span className="graffiti">un seul outil.</span>
            </h2>
            <p className="lede" data-reveal="">Même compte, même espace : tu peux lancer une cagnotte et une billetterie depuis le même endroit.</p>
          </div>
          <div className="flow-cols">
            <Flow title="Lancer une cagnotte" sub="Pour une cause, un projet, un coup de main." steps={FLOW_CAGNOTTE} />
            <Flow title="Ouvrir une billetterie" sub="Pour un concert, un tournoi, un marché." steps={FLOW_EVENT} />
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Pour ceux qui contribuent"}</div>
            <h2 className="section-title" data-reveal="">
              Donner ou acheter, <span className="graffiti">en 3 gestes.</span>
            </h2>
          </div>
          <Flow
            className="donor"
            title="Contribuer ou acheter un billet"
            sub="Sans compte, sans rien installer."
            steps={FLOW_DONOR}
          />
          <p className="note">
            Tu veux voir à quoi ça ressemble ? <Link href="/#demo" style={{ color: "var(--cyan)", borderBottom: "1px solid var(--cyan)" }}>Essaie la démo interactive</Link>.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

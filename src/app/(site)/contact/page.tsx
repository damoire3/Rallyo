import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FaqItems, PageHero } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { SiteIcon } from "@/components/site/site-icon";
import { CONTACT, HELP_QUESTIONS, HELP_TOPICS } from "@/lib/contact";
import { FAQ_FLAT, IMAGES } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact et aide",
  description:
    "Besoin d’aide avec une cagnotte, un billet ou un paiement ? Trouve une réponse rapide ou écris à l’équipe Rallyo.",
  alternates: { canonical: "/contact" },
};

type Channel = { icon: string; label: string; value: string; href?: string };

function getChannels(): Channel[] {
  const list: Channel[] = [];
  if (CONTACT.email) list.push({ icon: "mail", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` });
  if (CONTACT.whatsapp) list.push({ icon: "message", label: "WhatsApp", value: `+${CONTACT.whatsapp}`, href: `https://wa.me/${CONTACT.whatsapp}` });
  if (CONTACT.phone) list.push({ icon: "phone", label: "Téléphone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/[^\d+]/g, "")}` });
  if (CONTACT.hours) list.push({ icon: "clock", label: "Disponibilité", value: CONTACT.hours });
  return list;
}

const norm = (s: string) => s.replace(/[’‘]/g, "'");

export default function ContactPage() {
  const channels = getChannels();
  const questions = HELP_QUESTIONS.map((q) => FAQ_FLAT.find((f) => norm(f.q) === norm(q))).filter(
    (f): f is NonNullable<typeof f> => Boolean(f),
  );

  return (
    <>
      <PageHero
        eyebrow="Contact et aide"
        title={<>On est là, <span className="graffiti">écris-nous.</span></>}
        lede="Commence par chercher ta réponse ci-dessous : la plupart des questions y sont traitées. Sinon, écris-nous, on te répond."
        bg={IMAGES.murBg}
        tint="cyan"
        actions={
          <>
            <a href="#ecrire" className="btn-big">Nous écrire</a>
            <Link href="/faq" className="btn-outline">Voir la FAQ</Link>
          </>
        }
      />

      <section className="block" id="aide">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Aide rapide"}</div>
            <h2 className="section-title" data-reveal="">
              Choisis ton <span className="graffiti">sujet.</span>
            </h2>
          </div>
          <div className="help-grid">
            {HELP_TOPICS.map((t) => (
              <Link href={t.href} className="help-card" key={t.title} data-reveal="">
                <div className="icon"><SiteIcon name={t.icon} size={28} /></div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="go">Voir →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {questions.length > 0 && (
        <section className="block alt">
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="block-head">
              <div className="eyebrow">{"// Les plus posées"}</div>
              <h2 className="section-title" data-reveal="">
                Peut-être <span className="graffiti">déjà répondu.</span>
              </h2>
            </div>
            <FaqItems items={questions} />
            <Link href="/faq" className="more-link">Toutes les questions →</Link>
          </div>
        </section>
      )}

      <section className="block" id="ecrire">
        <div className="container">
          <div className="contact-grid">
            <div>
              <div className="eyebrow">{"// Nous écrire"}</div>
              <h2 className="section-title" data-reveal="">
                Une question <span className="graffiti">précise ?</span>
              </h2>
              <p className="lede" data-reveal="">
                Décris ta situation avec le plus de détails possible (lien de la page, montant, date) : on pourra te répondre
                plus vite et plus juste.
              </p>
              {channels.length > 0 ? (
                <div className="channel-list">
                  {channels.map((c) => {
                    const inner = (
                      <>
                        <span className="icon"><SiteIcon name={c.icon} size={24} /></span>
                        <span>
                          <small>{c.label}</small>
                          <strong>{c.value}</strong>
                        </span>
                      </>
                    );
                    return c.href ? (
                      <a className="channel" href={c.href} key={c.label} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {inner}
                      </a>
                    ) : (
                      <div className="channel" key={c.label}>{inner}</div>
                    );
                  })}
                </div>
              ) : (
                <p className="note">Le formulaire est, pour l’instant, le moyen le plus simple de nous joindre.</p>
              )}
            </div>

            <Suspense fallback={<div className="contact-form" aria-busy="true" style={{ minHeight: 420 }} />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="block alt" id="signaler">
        <div className="container">
          <div className="safety">
            <span className="icon"><SiteIcon name="shield-alert" size={30} /></span>
            <div>
              <h2 className="bangers" style={{ fontSize: "1.7rem", marginBottom: 8 }}>Reste prudent</h2>
              <p style={{ color: "rgba(244,241,234,.78)", lineHeight: 1.65, fontSize: ".95rem" }}>
                Ne communique jamais ton mot de passe, un code reçu par SMS ou ton code secret Mobile Money : l’équipe Rallyo ne te
                les demandera jamais. Avant de contribuer, vérifie la page de la cagnotte et l’identité de l’organisateur. Une
                page te semble suspecte ?{" "}
                <Link href="/contact?sujet=signalement#ecrire" style={{ color: "var(--cyan)", borderBottom: "1px solid var(--cyan)" }}>
                  Signale-la-nous
                </Link>{" "}
                avec son lien.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

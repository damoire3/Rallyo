"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { isTopic, LIMITS, TOPICS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY: ContactInput = { name: "", contact: "", topic: "", message: "" };

export function ContactForm() {
  const params = useSearchParams();
  const presetTopic = params.get("sujet");

  const [values, setValues] = useState<ContactInput>({ ...EMPTY, topic: isTopic(presetTopic) ? presetTopic : "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const startedAt = useRef(0);

  // Mesure du temps de remplissage (anti-robots) : un formulaire envoyé en < 2,5 s est ignoré côté serveur.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (field: keyof ContactInput, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (["name", "contact", "topic", "message"] as const).find((k) => found[k]);
      if (first) document.getElementById(`cf-${first}`)?.focus();
      return;
    }

    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus("sending");
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, elapsed: Date.now() - startedAt.current }),
      });
      if (res.ok) {
        setStatus("success");
        setFeedback("Merci, ton message est bien parti. Nous te répondrons à l’adresse ou au numéro indiqué.");
        setValues(EMPTY);
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; errors?: ContactErrors };
      if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        setStatus("idle");
        return;
      }
      setStatus("error");
      setFeedback(
        res.status === 429
          ? "Tu as envoyé plusieurs messages à la suite. Patiente quelques minutes avant de réessayer."
          : res.status === 503
            ? "Le formulaire n’est pas encore disponible. Utilise l’un des autres moyens de nous joindre, ou consulte la FAQ."
            : "Ton message n’a pas pu être envoyé. Réessaie dans un instant.",
      );
    } catch {
      setStatus("error");
      setFeedback("Connexion impossible. Vérifie ton réseau puis réessaie.");
    }
  }

  const remaining = LIMITS.messageMax - values.message.length;

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate aria-label="Formulaire de contact">
      <div className="field" data-invalid={Boolean(errors.name)}>
        <label htmlFor="cf-name">Ton nom</label>
        <input
          id="cf-name"
          name="name"
          autoComplete="name"
          maxLength={LIMITS.nameMax}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cf-name-err" : undefined}
        />
        {errors.name && <p className="err" id="cf-name-err">{errors.name}</p>}
      </div>

      <div className="field" data-invalid={Boolean(errors.contact)}>
        <label htmlFor="cf-contact">Email ou téléphone</label>
        <input
          id="cf-contact"
          name="contact"
          autoComplete="email"
          inputMode="email"
          maxLength={LIMITS.contactMax}
          value={values.contact}
          onChange={(e) => set("contact", e.target.value)}
          placeholder="Pour te répondre"
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={errors.contact ? "cf-contact-err" : undefined}
        />
        {errors.contact && <p className="err" id="cf-contact-err">{errors.contact}</p>}
      </div>

      <div className="field" data-invalid={Boolean(errors.topic)}>
        <label htmlFor="cf-topic">Sujet</label>
        <select
          id="cf-topic"
          name="topic"
          value={values.topic}
          onChange={(e) => set("topic", e.target.value)}
          aria-invalid={Boolean(errors.topic)}
          aria-describedby={errors.topic ? "cf-topic-err" : undefined}
        >
          <option value="">Choisir…</option>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.topic && <p className="err" id="cf-topic-err">{errors.topic}</p>}
      </div>

      <div className="field" data-invalid={Boolean(errors.message)}>
        <label htmlFor="cf-message">
          Ton message <span className="count">{remaining} restants</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          maxLength={LIMITS.messageMax}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder={
            values.topic === "signalement"
              ? "Colle le lien de la page concernée et explique ce qui te semble suspect."
              : "Décris ta situation le plus précisément possible."
          }
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-err" : "cf-message-hint"}
        />
        {errors.message ? (
          <p className="err" id="cf-message-err">{errors.message}</p>
        ) : (
          <p className="form-note" id="cf-message-hint">
            N’écris jamais ton mot de passe, un code reçu par SMS ni ton code secret : nous ne t’en demanderons jamais.
          </p>
        )}
      </div>

      {/* Champ piège pour les robots : invisible, ne pas remplir. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Ne pas remplir</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn-big" disabled={status === "sending"} style={{ border: 0, cursor: "pointer", fontFamily: "inherit" }}>
        {status === "sending" ? "Envoi…" : "Envoyer mon message"}
      </button>

      <div aria-live="polite">
        {status === "success" && <p className="form-status ok" role="status">{feedback}</p>}
        {status === "error" && <p className="form-status ko" role="alert">{feedback}</p>}
      </div>
    </form>
  );
}

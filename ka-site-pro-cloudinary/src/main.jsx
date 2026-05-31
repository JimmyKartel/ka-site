import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  Hammer,
  ImageOff,
  Images,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  Phone,
  Quote,
  Ruler,
  Send,
  ShieldCheck,
  Star,
  Trees,
  X,
} from "lucide-react";
import "./styles.css";

const PHONE_1 = "06 13 54 14 47";
const PHONE_2 = "06 19 28 40 55";
const EMAIL = "kaya42dalle@gmail.com";
const SIRET = "895 342 665 00018";
const CITY = "Lyon et alentours";

const navLinks = [
  ["#accueil", "Accueil"],
  ["#services", "Nos services"],
  ["#realisations", "Réalisations"],
  ["#apropos", "À propos"],
  ["#avis", "Avis clients"],
  ["#contact", "Contact"],
];

const serviceStrip = [
  {
    icon: Layers,
    title: "Pose de dalle",
    text: "Sur sable, béton ou sur plot",
  },
  {
    icon: Ruler,
    title: "Dalle sur plot",
    text: "Stabilité, drainage et finition nette",
  },
  {
    icon: Trees,
    title: "Terrasse bois",
    text: "Bois naturel ou composite",
  },
  {
    icon: Hammer,
    title: "Terrassement",
    text: "Préparation de sol et nivellement",
  },
  {
    icon: ShieldCheck,
    title: "Bordures",
    text: "Allées, contours et murets",
  },
];

const serviceCards = [
  {
    icon: Layers,
    title: "Dalle sur plot",
    text:
      "Pose sur plots réglables, drainage propre, calepinage précis et rendu moderne pour terrasses, balcons et contours de piscine.",
  },
  {
    icon: Trees,
    title: "Terrasse bois",
    text:
      "Terrasse en bois naturel ou composite avec lambourdage adapté, coupes propres, fixations soignées et finitions durables.",
  },
  {
    icon: Hammer,
    title: "Terrassement",
    text:
      "Préparation de terrain, décaissement, évacuation, remise à niveau et support stable avant la pose du revêtement.",
  },
  {
    icon: Ruler,
    title: "Aménagements extérieurs",
    text:
      "Marches, bordures, allées, seuils, angles et raccords traités pour un chantier cohérent du sol à la finition.",
  },
];

const proofPoints = [
  ["Travail soigné", "Finitions nettes et chantier propre"],
  ["Respect des délais", "Planning clair avant intervention"],
  ["Conseil terrain", "Solution adaptée au support existant"],
];

const categoryPriority = [
  "Tous",
  "Dalle sur plot",
  "Terrasse bois",
  "Terrassement",
  "Contour piscine",
  "Avant / Après",
  "Réalisation",
];

function phoneHref(phone) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function isValidPhone(phone) {
  if (!phone.trim()) return true;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 14;
}

function normalizeImages(images) {
  return (images || [])
    .filter((image) => image && image.id && image.thumb && image.full)
    .map((image) => ({
      ...image,
      category: image.category || "Réalisation",
      title: image.title || image.category || "Réalisation KA",
    }));
}

function useGallery() {
  const [state, setState] = useState({
    images: [],
    status: "loading",
    configured: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      try {
        const response = await fetch("/api/gallery", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`gallery_${response.status}`);
        }

        const data = await response.json();
        setState({
          images: normalizeImages(data.images),
          status: "ready",
          configured: data.configured !== false,
          error: null,
        });
      } catch (error) {
        if (error.name === "AbortError") return;
        setState({
          images: [],
          status: "error",
          configured: false,
          error: "La galerie Cloudinary est indisponible pour le moment.",
        });
      }
    }

    loadGallery();
    return () => controller.abort();
  }, []);

  return state;
}

function LogoMark() {
  return (
    <svg className="logoMark" viewBox="0 0 98 76" aria-hidden="true">
      <path
        d="M10 8h15v25L49 8h20L39 39l32 29H50L25 45v23H10V8Z"
        fill="#f7f7f7"
      />
      <path
        d="M67 8h18v60H70V41L51 68H34L67 8Z"
        fill="#f49a12"
      />
      <path d="M69 30 55 55h14V30Z" fill="#101417" opacity=".88" />
      <path
        d="M23 69h20l-9 7H14l9-7ZM72 69h17l-8 7H64l8-7Z"
        fill="#f49a12"
      />
    </svg>
  );
}

function Logo({ compact = false }) {
  return (
    <div className={compact ? "brand compact" : "brand"}>
      <LogoMark />
      {!compact && (
        <div className="brandText">
          <strong>
            Kaya <span>Ahmet</span>
          </strong>
          <small>Aménagement extérieur</small>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="siteHeader">
      <a className="headerBrand" href="#accueil" aria-label="Accueil Kaya Ahmet">
        <Logo />
      </a>

      <nav className={open ? "mainNav open" : "mainNav"} aria-label="Navigation principale">
        {navLinks.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <a className="headerCall" href={phoneHref(PHONE_1)} aria-label={`Appeler ${PHONE_1}`}>
        <Phone size={18} />
        <span>{PHONE_1}</span>
      </a>

      <button
        className="menuButton"
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function Hero({ heroImage }) {
  const heroStyle = heroImage?.full
    ? { "--hero-image": `url("${heroImage.full}")` }
    : undefined;

  return (
    <section
      id="accueil"
      className={heroImage?.full ? "hero hasImage" : "hero"}
      style={heroStyle}
    >
      <div className="heroShade" />
      <div className="heroInner">
        <div className="heroCopy">
          <p className="eyebrow">Specialiste de vos</p>
          <h1>
            Aménagements <span>extérieurs</span>
          </h1>
          <p className="heroLead">
            Du sol à la finition, Kaya Ahmet s'occupe de vos terrasses bois,
            dalles sur plot, terrassements, allées et bordures à Lyon et alentours.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#contact">
              Demande de devis gratuit <ArrowRight size={18} />
            </a>
            <a className="outlineButton" href="#realisations">
              Nos réalisations <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <aside className="heroTrust" aria-label="Engagement artisan local">
          <ShieldCheck />
          <div>
            <strong>Artisan local</strong>
            <span>Sérieux, qualité et respect des délais</span>
          </div>
        </aside>

        <a className="quoteRibbon" href="#contact">
          <Logo compact />
          <span>
            <strong>Devis gratuit</strong>
            Rapide et sans engagement
          </span>
        </a>
      </div>
    </section>
  );
}

function ServiceStrip() {
  return (
    <section className="serviceStrip" aria-label="Services principaux">
      {serviceStrip.map(({ icon: Icon, title, text }) => (
        <article key={title} className="stripItem">
          <Icon />
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="servicesSection">
      <div className="sectionIntro">
        <p className="eyebrow">Nos services</p>
        <h2>Des extérieurs propres, durables et bien finis</h2>
        <p>
          Chaque chantier commence par le support : niveaux, drainage, découpes,
          raccords et finitions sont traités avant l'esthétique.
        </p>
      </div>

      <div className="serviceCards">
        {serviceCards.map(({ icon: Icon, title, text }) => (
          <article key={title} className="serviceCard">
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function About({ images }) {
  const cards = images.slice(0, 4);

  return (
    <section id="apropos" className="aboutSection">
      <div className="aboutCopy">
        <p className="eyebrow">À propos</p>
        <h2>
          L'expertise au service de <span>vos extérieurs</span>
        </h2>
        <p>
          Basée à Lyon et ses alentours, l'entreprise accompagne les projets
          d'aménagement extérieur avec une approche directe : choix du support,
          solution technique adaptée et finition propre.
        </p>

        <div className="proofGrid">
          {proofPoints.map(([title, text]) => (
            <article key={title}>
              <BadgeCheck />
              <strong>{title}</strong>
              <span>{text}</span>
            </article>
          ))}
        </div>

        <div className="siretBox">SIRET : {SIRET}</div>
      </div>

      <div className="aboutGallery" aria-label="Aperçu des réalisations">
        {cards.length ? (
          cards.map((image) => (
            <figure key={image.id}>
              <img src={image.thumb} alt={image.title} loading="lazy" />
              <figcaption>{image.category}</figcaption>
            </figure>
          ))
        ) : (
          <div className="imagePlaceholder">
            <Images />
            <span>Photos Cloudinary en cours de chargement</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Gallery({ images, status, configured, error }) {
  const [active, setActive] = useState("Tous");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const categories = useMemo(() => {
    const found = Array.from(new Set(images.map((image) => image.category)));
    return categoryPriority.filter((category) => category === "Tous" || found.includes(category));
  }, [images]);

  const visibleImages = useMemo(() => {
    if (active === "Tous") return images;
    return images.filter((image) => image.category === active);
  }, [active, images]);

  const selectedImage =
    typeof selectedIndex === "number" ? visibleImages[selectedIndex] || null : null;

  useEffect(() => {
    setSelectedIndex(null);
  }, [active]);

  useEffect(() => {
    if (!selectedImage) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") {
        setSelectedIndex((index) => ((index ?? 0) + 1) % visibleImages.length);
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((index) => ((index ?? 0) - 1 + visibleImages.length) % visibleImages.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage, visibleImages.length]);

  return (
    <section id="realisations" className="gallerySection">
      <div className="sectionIntro split">
        <div>
          <p className="eyebrow">Réalisations</p>
          <h2>Toutes les photos Cloudinary</h2>
          <p>
            La galerie affiche automatiquement les images du dossier Cloudinary
            `ka-realisations`, avec optimisation de taille et de format.
          </p>
        </div>
        <div className="galleryCount">
          <Camera />
          <strong>{images.length}</strong>
          <span>photos publiées</span>
        </div>
      </div>

      <div className="filterBar" aria-label="Filtrer les réalisations">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={active === category ? "active" : ""}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="galleryState">
          <Images />
          <span>Chargement des réalisations...</span>
        </div>
      )}

      {status !== "loading" && (!configured || error) && (
        <div className="galleryState warning">
          <ImageOff />
          <span>{error || "Cloudinary n'est pas configuré sur cet environnement."}</span>
        </div>
      )}

      {status === "ready" && images.length === 0 && (
        <div className="galleryState">
          <ImageOff />
          <span>Aucune image trouvée dans le dossier Cloudinary configuré.</span>
        </div>
      )}

      {visibleImages.length > 0 && (
        <div className="galleryGrid">
          {visibleImages.map((image, index) => (
            <button
              key={image.id}
              className="galleryItem"
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Agrandir ${image.title}`}
            >
              <img src={image.thumb} alt={image.title} loading="lazy" />
              <span className="galleryLabel">{image.category}</span>
              <span className="zoomIcon" aria-hidden="true">
                <Maximize2 size={18} />
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="closeLightbox"
            type="button"
            aria-label="Fermer"
            onClick={() => setSelectedIndex(null)}
          >
            <X />
          </button>
          <button
            className="lightboxNav previous"
            type="button"
            aria-label="Image précédente"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((index) => ((index ?? 0) - 1 + visibleImages.length) % visibleImages.length);
            }}
          >
            <ArrowRight />
          </button>
          <img
            src={selectedImage.full}
            alt={selectedImage.title}
            onClick={(event) => event.stopPropagation()}
          />
          <button
            className="lightboxNav next"
            type="button"
            aria-label="Image suivante"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((index) => ((index ?? 0) + 1) % visibleImages.length);
            }}
          >
            <ArrowRight />
          </button>
          <div className="lightboxCaption" onClick={(event) => event.stopPropagation()}>
            <strong>{selectedImage.category}</strong>
            <span>{selectedImage.title}</span>
          </div>
        </div>
      )}
    </section>
  );
}

function Reviews() {
  return (
    <section id="avis" className="reviewsSection">
      <div className="sectionIntro">
        <p className="eyebrow">Avis clients</p>
        <h2>Des engagements mesurables sur chantier</h2>
        <p>
          Les retours clients doivent reposer sur du concret : propreté,
          délais, finitions et conseil. Aucun témoignage nominatif n'est inventé.
        </p>
      </div>

      <div className="reviewGrid">
        {[
          ["Finitions", "Angles, seuils, bordures et coupes traités proprement."],
          ["Délais", "Intervention planifiée avec un périmètre clair."],
          ["Conseil", "Solution choisie selon le support, l'eau et l'usage."],
        ].map(([title, text]) => (
          <article key={title}>
            <Quote />
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="stars" aria-label="Engagement qualité">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star key={value} size={17} fill="currentColor" />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function validateContactForm(form) {
  const errors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Nom requis.";
  }

  if (!isValidPhone(form.phone)) {
    errors.phone = "Téléphone invalide.";
  }

  if (form.message.trim().length < 12) {
    errors.message = "Précisez votre projet en quelques mots.";
  }

  return errors;
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: "Dalle sur plot",
    message: "",
  });
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function submitContact(event) {
    event.preventDefault();
    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const subject = `Demande de devis - ${form.service}`;
    const body = [
      `Nom : ${form.name.trim()}`,
      `Téléphone : ${form.phone.trim() || "Non renseigné"}`,
      `Ville : ${form.city.trim() || "Non renseignée"}`,
      `Projet : ${form.service}`,
      "",
      "Message :",
      form.message.trim(),
    ].join("\n");

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="contactSection">
      <div className="contactIntro">
        <p className="eyebrow">Contact</p>
        <h2>Demande de devis gratuit</h2>
        <p>
          Envoyez les dimensions, photos et contraintes du terrain. Le message
          est préparé automatiquement pour partir vers l'adresse email KA.
        </p>

        <div className="contactFacts">
          <a href={phoneHref(PHONE_1)}>
            <Phone />
            <span>{PHONE_1}</span>
          </a>
          <a href={phoneHref(PHONE_2)}>
            <Phone />
            <span>{PHONE_2}</span>
          </a>
          <a href={`mailto:${EMAIL}`}>
            <Mail />
            <span>{EMAIL}</span>
          </a>
          <span>
            <MapPin />
            <span>{CITY}</span>
          </span>
          <span>
            <FileText />
            <span>SIRET : {SIRET}</span>
          </span>
        </div>
      </div>

      <form className="contactForm" onSubmit={submitContact} noValidate>
        <label>
          Nom
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            required
          />
          {errors.name && <span className="fieldError">{errors.name}</span>}
        </label>

        <label>
          Téléphone
          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            placeholder="06 00 00 00 00"
          />
          {errors.phone && <span className="fieldError">{errors.phone}</span>}
        </label>

        <label>
          Ville
          <input
            name="city"
            value={form.city}
            onChange={updateField}
            autoComplete="address-level2"
            placeholder="Lyon, Villeurbanne, Bron..."
          />
        </label>

        <label>
          Type de projet
          <select name="service" value={form.service} onChange={updateField}>
            <option>Dalle sur plot</option>
            <option>Terrasse bois</option>
            <option>Terrassement</option>
            <option>Aménagements et bordures</option>
            <option>Autre projet extérieur</option>
          </select>
        </label>

        <label className="messageField">
          Votre besoin
          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            rows="5"
            aria-invalid={Boolean(errors.message)}
            placeholder="Surface, support existant, accès, délai souhaité..."
            required
          />
          {errors.message && <span className="fieldError">{errors.message}</span>}
        </label>

        <button className="primaryButton fullWidth" type="submit">
          Envoyer par email <Send size={18} />
        </button>
      </form>
    </section>
  );
}

function InfoBar() {
  return (
    <section className="infoBar" aria-label="Informations rapides">
      <article>
        <MapPin />
        <div>
          <strong>Lyon et alentours</strong>
          <span>Déplacement dans toute la région</span>
        </div>
      </article>
      <article>
        <Phone />
        <div>
          <strong>{PHONE_1}</strong>
          <span>{PHONE_2}</span>
        </div>
      </article>
      <article>
        <Mail />
        <div>
          <strong>{EMAIL}</strong>
          <span>Réponse pour devis gratuit</span>
        </div>
      </article>
      <article>
        <Clock3 />
        <div>
          <strong>Devis gratuit</strong>
          <span>Rapide et sans engagement</span>
        </div>
      </article>
    </section>
  );
}

function FloatingCta() {
  return (
    <a className="floatingCta" href="#contact">
      <Mail />
      <span>Devis gratuit</span>
    </a>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Logo />
      <div>
        <strong>Terrasse bois, dalle sur plot et aménagement extérieur à Lyon</strong>
        <span>SIRET : {SIRET}</span>
      </div>
    </footer>
  );
}

function App() {
  const gallery = useGallery();
  const heroImage =
    gallery.images.find((image) => image.category === "Terrasse bois") ||
    gallery.images.find((image) => image.category === "Dalle sur plot") ||
    gallery.images[0];

  return (
    <>
      <Navbar />
      <main>
        <Hero heroImage={heroImage} />
        <ServiceStrip />
        <About images={gallery.images} />
        <Services />
        <Gallery {...gallery} />
        <Reviews />
        <Contact />
        <InfoBar />
      </main>
      <FloatingCta />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);

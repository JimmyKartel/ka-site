import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Phone, Mail, MapPin, Layers, Trees, BadgeCheck, Ruler, Hammer,
  Star, ArrowRight, Menu, X, Images, MessageCircle, CheckCircle2
} from "lucide-react";
import "./styles.css";

const PHONE_1 = "06 13 54 14 47";
const PHONE_2 = "06 19 28 40 55";
const EMAIL = "kaya42dalle@gmail.com";
const SIRET = "895 342 665 00018";

const fallbackImages = [
  { id:"demo-1", category:"Terrasse bois", thumb:"", full:"", title:"Terrasse bois premium" },
  { id:"demo-2", category:"Dalle sur plot", thumb:"", full:"", title:"Dalle sur plot moderne" },
  { id:"demo-3", category:"Contour piscine", thumb:"", full:"", title:"Contour piscine" },
  { id:"demo-4", category:"Avant / Après", thumb:"", full:"", title:"Avant / Après" },
];

function Logo({ compact = false }) {
  return (
    <div className="logo">
      <div className="mark">
        <span className="k">K</span>
        <span className="a">A</span>
        <span className="miniSlab" />
        <span className="miniPlot p1" />
        <span className="miniPlot p2" />
        <span className="miniWood" />
      </div>
      {!compact && (
        <div className="logoText">
          <strong>KA</strong>
          <small>Terrasse bois • Dalle sur plot</small>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    ["#services", "Services"],
    ["#realisations", "Réalisations"],
    ["#process", "Méthode"],
    ["#contact", "Contact"],
  ];
  return (
    <header className="navbar">
      <a href="#" aria-label="Accueil"><Logo /></a>
      <nav className={open ? "navLinks open" : "navLinks"}>
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <a className="navPhone" href={`tel:${PHONE_1.replaceAll(" ", "")}`}><Phone size={18}/>{PHONE_1}</a>
      <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="heroPattern" />
      <div className="heroInner">
        <div className="heroCopy">
          <p className="overline">Spécialiste aménagement extérieur à Lyon</p>
          <h1>Terrasse bois & dalle sur plot</h1>
          <p className="heroLead">
            KA transforme vos extérieurs avec des poses propres, modernes et durables :
            terrasses bois, dalles sur plot, contours de piscine et finitions soignées.
          </p>
          <div className="heroActions">
            <a className="primary" href="#contact">Demander un devis gratuit <ArrowRight size={18}/></a>
            <a className="secondary" href="#realisations">Voir les réalisations</a>
          </div>
        </div>
        <div className="heroCard">
          <BadgeCheck />
          <div>
            <strong>Devis gratuit</strong>
            <span>Étude personnalisée selon vos besoins</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    [Layers, "Dalle sur plot", "Pose sur plots réglables, drainage naturel, rendu contemporain et entretien simple."],
    [Trees, "Terrasse bois", "Bois naturel ou composite, chaleureux, propre et valorisant pour votre extérieur."],
    [Ruler, "Calepinage & niveaux", "Alignement, pente, découpes et préparation pour éviter les finitions bricolées."],
    [Hammer, "Finitions", "Marches, bordures, angles, seuils, contours de piscine et raccords propres."],
  ];
  return (
    <section id="services" className="services">
      {items.map(([Icon, title, text]) => (
        <article key={title} className="service">
          <Icon />
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}

function Gallery() {
  const [images, setImages] = useState([]);
  const [configured, setConfigured] = useState(true);
  const [active, setActive] = useState("Tous");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        setConfigured(data.configured !== false);
        setImages((data.images || []).length ? data.images : fallbackImages);
      })
      .catch(() => {
        setConfigured(false);
        setImages(fallbackImages);
      });
  }, []);

  const categories = useMemo(() => ["Tous", ...Array.from(new Set(images.map(i => i.category)))], [images]);
  const visible = active === "Tous" ? images : images.filter(i => i.category === active);

  return (
    <section id="realisations" className="gallerySection">
      <div className="sectionHead">
        <div>
          <p className="overline">Portfolio automatique</p>
          <h2>Réalisations KA</h2>
          <p>
            Ajoutez vos photos dans Cloudinary : elles s’affichent automatiquement ici,
            sans modifier le code du site.
          </p>
        </div>
        <div className="filterBar">
          {categories.map(cat => <button key={cat} className={active === cat ? "active" : ""} onClick={() => setActive(cat)}>{cat}</button>)}
        </div>
      </div>

      {!configured && (
        <div className="warning">
          <Images size={20}/>
          Cloudinary n’est pas encore configuré. Les blocs ci-dessous sont des exemples visuels.
        </div>
      )}

      <div className="galleryGrid">
        {visible.map((img, idx) => (
          <button key={img.id} className={`galleryItem demo${idx % 4}`} onClick={() => setLightbox(img)}>
            {img.thumb ? <img src={img.thumb} alt={`Réalisation KA - ${img.category}`} loading="lazy" /> : null}
            <span>{img.category}</span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="closeBox"><X /></button>
          {lightbox.full ? <img src={lightbox.full} alt={`Réalisation KA - ${lightbox.category}`} /> : <div className="demoLarge">{lightbox.category}</div>}
        </div>
      )}
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="process">
      <div>
        <p className="overline">Méthode claire</p>
        <h2>Un chantier propre du premier appel à la finition</h2>
      </div>
      <div className="steps">
        {[
          ["01", "Échange", "Vous envoyez vos photos, dimensions et attentes."],
          ["02", "Conseil", "Choix de la solution : bois, composite, dalle, plots, finitions."],
          ["03", "Devis", "Chiffrage clair et gratuit, sans engagement."],
          ["04", "Pose", "Réalisation soignée avec respect des niveaux et des délais."],
        ].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contactPanel">
        <Logo />
        <h2>Votre projet extérieur commence ici</h2>
        <p>Envoyez vos photos et dimensions pour obtenir un premier avis rapide.</p>
        <div className="badges">
          <span><CheckCircle2/> Devis gratuit</span>
          <span><CheckCircle2/> Lyon et alentours</span>
          <span><CheckCircle2/> SIRET : {SIRET}</span>
        </div>
      </div>
      <div className="contactCards">
        <a href={`tel:${PHONE_1.replaceAll(" ", "")}`}><Phone />{PHONE_1}</a>
        <a href={`tel:${PHONE_2.replaceAll(" ", "")}`}><Phone />{PHONE_2}</a>
        <a href={`mailto:${EMAIL}`}><Mail />{EMAIL}</a>
        <span><MapPin />Lyon et alentours</span>
      </div>
    </section>
  );
}

function FloatingWhatsApp() {
  const text = encodeURIComponent("Bonjour KA, je souhaite un devis pour une terrasse / dalle sur plot.");
  return <a className="whatsapp" href={`https://wa.me/33${PHONE_1.replace(/\D/g, "").slice(1)}?text=${text}`} target="_blank" rel="noreferrer"><MessageCircle/> Devis WhatsApp</a>;
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Process />
        <Contact />
      </main>
      <FloatingWhatsApp />
      <footer>
        <span>© KA — Terrasse bois & dalle sur plot</span>
        <span>SIRET : {SIRET}</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);

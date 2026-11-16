/* ==========================================================================
   ELYOS — données du site
   Tout le contenu vit ici. Une valeur `null` s'affiche comme placeholder
   visible [À RENSEIGNER] : rien n'est inventé.
   ========================================================================== */
window.ELYOS = {

  config: {
    contactEmail: null,        // ex. "contact@elyos.fr"
    instagram: null,           // ex. "https://instagram.com/elyos"
    tiktok: null,
    checkoutUrl: null,         // URL de la boutique (Shopify…) quand elle est prête
    newsletterEndpoint: null,  // URL d'inscription (Brevo, Klaviyo, Shopify…)
    contactEndpoint: null,     // URL d'envoi du formulaire de contact (Formspree, Getform…)
    replyDelay: null           // ex. "sous 48 h"
  },

  /* Chaque image existe en deux largeurs : s (900px) et l (1800px) */
  assets: /*ASSETS*/{
    hero:      { s: "assets/hero-s.jpg",      l: "assets/hero-l.jpg" },
    portrait:  { s: "assets/portrait-s.jpg",  l: "assets/portrait-l.jpg" },
    stairs:    { s: "assets/stairs-s.jpg",    l: "assets/stairs-l.jpg" },
    sky:       { s: "assets/sky-s.jpg",       l: "assets/sky-l.jpg" },
    cloud:     { s: "assets/cloud-s.jpg",     l: "assets/cloud-l.jpg" },
    pocket:    { s: "assets/pocket-s.jpg",    l: "assets/pocket-l.jpg" },
    seatThigh: { s: "assets/seatThigh-s.jpg", l: "assets/seatThigh-l.jpg" },
    seatCity:  { s: "assets/seatCity-s.jpg",  l: "assets/seatCity-l.jpg" },
    seatSun:   { s: "assets/seatSun-s.jpg",   l: "assets/seatSun-l.jpg" },
    seatSide:  { s: "assets/seatSide-s.jpg",  l: "assets/seatSide-l.jpg" },
    seatLeg:   { s: "assets/seatLeg-s.jpg",   l: "assets/seatLeg-l.jpg" },
    short:     { s: "assets/short-s.jpg",     l: "assets/short-l.jpg" },
    cargo:     { s: "assets/cargo-s.jpg",     l: "assets/cargo-l.jpg" }
  }/*/ASSETS*/,

  /* Grille de tailles — À CONFIRMER avant mise en ligne */
  sizes: ["XS", "S", "M", "L", "XL"],

  /* Pièces du Drop 01.
     name/price/status/description : null = placeholder affiché.
     visible : uniquement ce qu'on voit sur les photos.
     images : k = clé d'asset, pos = cadrage, zoom = recadrage serré. */
  products: [
    {
      id: "hoodie",
      group: "Hauts",
      name: null,
      category: "Hoodie",
      color: "Onyx",
      price: null,
      status: null,
      description: null,
      visible: ["Capuche", "Coupe ample, épaules tombantes", "Monogramme au dos"],
      images: [
        { k: "cloud",  pos: "50% 30%" },
        { k: "hero",   pos: "48% 35%" },
        { k: "stairs", pos: "52% 40%" }
      ]
    },
    {
      id: "ground-loose-i",
      group: "Bas",
      name: "GROUND Loose I",
      category: "Jogging",
      color: "Onyx",
      price: 89,
      status: null,
      description: null,
      visible: ["Coupe large", "Wordmark sur la poche arrière", "Wordmark le long de la jambe"],
      images: [
        { k: "seatSide", pos: "62% 72%", zoom: 1.7 },
        { k: "pocket",   pos: "53% 96%", zoom: 2.4 },
        { k: "seatLeg",  pos: "68% 66%", zoom: 1.6 }
      ]
    },
    {
      id: "cargo",
      group: "Bas",
      name: null,
      category: "Pantalon cargo",
      color: "Onyx",
      price: null,
      status: null,
      description: null,
      visible: ["Poches à rabat sur les cuisses", "Bas ajustables par cordon", "Monogramme et wordmark sur la poche"],
      images: [
        { k: "cargo", pos: "50% 50%" },
        { k: "cargo", pos: "62% 30%", zoom: 1.9 },
        { k: "cargo", pos: "60% 92%", zoom: 1.8 }
      ]
    },
    {
      id: "short",
      group: "Bas",
      name: null,
      category: "Short",
      color: "Onyx",
      price: null,
      status: null,
      description: null,
      visible: ["Taille élastiquée", "Cordon à embouts métal", "Monogramme et wordmark sur la cuisse"],
      images: [
        { k: "short", pos: "50% 50%" },
        { k: "short", pos: "40% 42%", zoom: 2 },
        { k: "short", pos: "70% 74%", zoom: 2.2 }
      ]
    }
  ],

  /* Page Collection */
  collection: {
    title: "Drop 01",
    intro: null,               // texte de présentation de la collection
    featured: ["hoodie", "ground-loose-i"]   // pièces mises en avant sur l'accueil
  },

  /* Page Maison */
  house: {
    founders: null,            // noms des fondateurs
    vision: null,
    garment: null,             // rapport au vêtement
    making: null,              // matières et fabrication
    slogans: ["Ce que tu portes dit qui tu deviens.", "Wear the discipline. Become the proof.", "Built in silence. Worn with intent."]
  },

  /* Gros plans (page Collection, liés aux pièces) */
  details: [
    { title: "Monogramme au dos",   product: "hoodie",         img: { k: "seatThigh", pos: "38% 40%", zoom: 1.9 }, ratio: "4/3" },
    { title: "Wordmark de poche",   product: "ground-loose-i", img: { k: "pocket",    pos: "52% 90%", zoom: 2.3 }, ratio: "3/4" },
    { title: "Cordon de serrage",   product: "short",          img: { k: "short",     pos: "40% 44%", zoom: 2.1 }, ratio: "1/1" },
    { title: "Poche à rabat",       product: "cargo",          img: { k: "cargo",     pos: "62% 30%", zoom: 1.8 }, ratio: "16/10" }
  ],

  journal: [
    {
      id: "drop-01",
      title: "Drop 01, la série",
      date: null,
      intro: null,
      credits: null,
      worn: ["hoodie", "ground-loose-i"],
      images: [
        { k: "seatCity",  pos: "50% 50%", layout: "full",  alt: "Assis sur un muret face à la ville, hoodie et jogging noirs" },
        { k: "stairs",    pos: "50% 45%", layout: "left",  alt: "Debout dans un escalier de béton, monogramme au dos" },
        { k: "portrait",  pos: "50% 60%", layout: "tall",  alt: "Assis en hauteur sur un mur de béton, vue verticale" },
        { k: "sky",       pos: "50% 40%", layout: "right", alt: "Contre-plongée sous un ciel clair, cargo et hoodie" },
        { k: "seatLeg",   pos: "50% 50%", layout: "full",  alt: "Assis, wordmark visible le long de la jambe" },
        { k: "seatThigh", pos: "50% 45%", layout: "left",  alt: "Assis sur un muret, lumière dure en diagonale" }
      ]
    }
  ],

  info: {
    "livraison-retours": {
      title: "Livraison et retours",
      rows: [["Zones de livraison", null], ["Délais", null], ["Frais de port", null], ["Retours", null], ["Remboursement", null]]
    },
    "guide-des-tailles": { title: "Guide des tailles", table: true },
    "mentions-legales": {
      title: "Mentions légales",
      rows: [["Éditeur du site", null], ["Forme juridique et SIRET", null], ["Adresse", null], ["Directeur de la publication", null], ["Hébergeur", null]]
    },
    "cgv": {
      title: "Conditions générales de vente",
      rows: [["Texte des CGV", null]]
    },
    "confidentialite": {
      title: "Confidentialité",
      rows: [["Données collectées", null], ["Finalités", null], ["Durée de conservation", null], ["Contact RGPD", null]]
    }
  }
};

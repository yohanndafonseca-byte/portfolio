/* ==========================================================================
   ELYOS — logique du site
   Modules : utilitaires · composants · pages · routeur · panier · navigation
   Routes : #/  #/shop  #/collection  #/maison  #/journal  #/journal/:id
            #/contact  #/piece/:id  #/info/:id  (sinon 404)
   ========================================================================== */
(() => {
"use strict";
const D = window.ELYOS;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Utilitaires ---------- */
const ph = t => `<span class="ph"></span>`;
const eur = n => n.toLocaleString("fr-FR") + " €";
const price = p => p.price == null ? `<span class="soon">Prix à venir</span>` : eur(p.price);
const title = p => p.name || p.category;
const byId = id => D.products.find(p => p.id === id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const val = (v, label) => v ? esc(v) : ph(label);
const pad2 = n => String(n).padStart(2, "0");

function srcAttrs(k) {
  const a = D.assets[k];
  return a.s ? `src="${a.l}" srcset="${a.s} 900w, ${a.l} 1800w"` : `src="${a.l}"`;
}
function frameStyle(r) {
  const pos = r.pos || "50% 50%";
  return `object-position:${pos}` + (r.zoom ? `;transform:scale(${r.zoom});transform-origin:${pos}` : "");
}
function img(r, alt, { sizes = "100vw", eager = false, cls = "" } = {}) {
  return `<img ${srcAttrs(r.k)} sizes="${sizes}" alt="${esc(alt)}" style="${frameStyle(r)}"${cls ? ` class="${cls}"` : ""}${eager ? "" : ` loading="lazy" decoding="async"`}>`;
}

/* ---------- Composants ---------- */
/* Carte produit : image (2e vue au survol), nom, catégorie, prix */
function card(p, sizes = "(max-width:820px) 50vw, 40vw") {
  return `<a class="card" href="#/piece/${p.id}">
    <span class="frame rv">${img(p.images[0], `${title(p)} ELYOS, porté`, { sizes })}${p.images[1] ? img(p.images[1], "", { sizes, cls: "b" }) : ""}</span>
    <span class="card__row"><span>${esc(title(p))}</span><span>${price(p)}</span></span>
    <span class="card__sub">${p.name ? p.category + ", " : ""}${p.color}</span>
  </a>`;
}
/* Pièce en mise en page éditoriale (page Collection) */
function editorial(p, i, n) {
  return `<article class="piece" aria-labelledby="pn-${p.id}">
    <div class="piece__media"><a class="frame rv" href="#/piece/${p.id}" aria-label="Voir ${esc(title(p))}">
      ${img(p.images[0], `${title(p)} ELYOS, porté`, { sizes: "(max-width:900px) 100vw, 58vw" })}
      ${p.images[1] ? img(p.images[1], "", { sizes: "(max-width:900px) 100vw, 58vw", cls: "b" }) : ""}</a></div>
    <div class="piece__info">
      <p class="piece__cat">${pad2(i + 1)} / ${pad2(n)}${p.name ? `, ${p.category}` : ""}</p>
      <h2 class="t2 piece__name" id="pn-${p.id}">${esc(title(p))}${p.name ? "" : ph("NOM À RENSEIGNER")}</h2>
      <div class="piece__meta"><span>${p.color}</span><span class="price">${price(p)}</span></div>
      <a class="ul piece__go" href="#/piece/${p.id}">Voir la pièce</a>
    </div>
  </article>`;
}
const pageHead = (h1, side = "") => `<header class="phead"><h1 class="t1">${h1}</h1>${side ? `<div class="phead__side">${side}</div>` : ""}</header>`;

/* ---------- Pages ---------- */
const Pages = {

  home() {
    const feat = D.collection.featured.map(byId).filter(Boolean);
    const s = D.journal[0];
    return {
      title: "ELYOS — Built in silence. Worn with intent.",
      desc: "ELYOS. Drop 01 en Onyx : hoodie, jogging, cargo et short. Built in silence. Worn with intent.",
      home: true,
      html: `
      <section class="hero${firstLoad ? "" : " calm"}" aria-label="ELYOS">
        <div class="hero__cut"><picture>
          <source media="(max-width:700px)" srcset="${D.assets.portrait.s ? `${D.assets.portrait.s} 900w, ${D.assets.portrait.l} 1800w` : D.assets.portrait.l}">
          ${img({ k: "hero", pos: "50% 40%" }, "Silhouette de dos en hoodie noir ELYOS, monogramme au dos, dans une architecture de béton brut", { eager: true })}
        </picture></div>
        <div class="hero__txt">
          <h1 class="wm hero__mark">Elyos</h1>
          <div class="hero__side"><p>Ce que tu portes dit qui tu deviens.</p><a class="ul" href="#/shop">Découvrir le Drop 01</a></div>
        </div>
      </section>

      <section class="breath" aria-labelledby="b-t">
        <h2 class="t1" id="b-t">Built in silence.<br>Worn with intent.</h2>
        <p>Des pièces noires, des coupes amples, un monogramme porté dans le dos. Rien à prouver de face.</p>
        <figure class="rv">${img({ k: "seatSun" }, "Assis sur un muret de béton, lumière rasante en diagonale", { sizes: "(max-width:900px) 80vw, 58vw" })}</figure>
      </section>

      <section class="duo" aria-labelledby="duo-t">
        <div class="duo__head"><h2 class="t2" id="duo-t">Drop 01</h2><a class="ul" href="#/shop">Tout le shop</a></div>
        <div class="duo__grid">${feat.map(p => card(p, "(max-width:820px) 100vw, 58vw")).join("")}</div>
      </section>

      <section class="inter" aria-labelledby="j-t">
        ${img({ k: "seatCity", pos: "42% 50%" }, "Assis face à la ville, hoodie et jogging ELYOS")}
        <div class="inter__txt"><h2 class="t1" id="j-t">${esc(s.title.replace(", ", ",<br>")).replace("&lt;br&gt;", "<br>")}</h2><a class="ul" href="#/journal/${s.id}">Lire dans le journal</a></div>
      </section>

      <section class="house" aria-labelledby="h-t">
        <div class="house__img rv">${img({ k: "portrait" }, "Assis en hauteur sur un mur de béton", { sizes: "(max-width:900px) 70vw, 33vw" })}</div>
        <div class="house__txt">
          <svg class="house__mark" role="img" aria-label="Monogramme ELYOS"><use href="#mark"/></svg>
          <h2 class="t1" id="h-t">Deux initiales.<br>Un seul signe.</h2>
          <p class="house__lead">ELYOS est née à deux. Son nom rassemble les initiales de ses fondateurs, E et Y. Son monogramme les fond en une seule ligne brisée.</p>
          <div class="house__sig"><a class="ul" href="#/maison">La maison</a></div>
        </div>
      </section>`
    };
  },

  shop(q) {
    const groups = ["Tout", ...new Set(D.products.map(p => p.group))];
    const cur = groups.includes(q.cat) ? q.cat : "Tout";
    const list = D.products.filter(p => cur === "Tout" || p.group === cur);
    return {
      title: "Shop — ELYOS",
      desc: "Toutes les pièces ELYOS du Drop 01.",
      html: `<div class="page">
        ${pageHead("Shop", `<p>${D.products.length} pièces, Drop 01.</p>
          <div class="filters" role="group" aria-label="Filtrer par catégorie">${groups.map(g => `<button aria-pressed="${g === cur}" data-cat="${g}">${g}</button>`).join("")}</div>`)}
        <div class="shop" aria-live="polite">${list.length ? list.map(p => card(p)).join("") :
          `<p class="shop__empty">Aucune pièce dans cette catégorie pour l'instant. <button class="ul" data-cat="Tout">Tout afficher</button></p>`}</div>
        <div class="endcta"><span class="t3">Besoin d'aide pour la taille ?</span><a class="ul" href="#/info/guide-des-tailles">Guide des tailles</a></div>
      </div>`,
      mount(root) {
        $$("[data-cat]", root).forEach(b => b.onclick = () => {
          const c = b.dataset.cat;
          Router.replace(c === "Tout" ? "#/shop" : `#/shop?cat=${encodeURIComponent(c)}`);
        });
      }
    };
  },

  collection() {
    const n = D.products.length;
    return {
      title: `Collection ${D.collection.title} — ELYOS`,
      desc: "Le Drop 01 d'ELYOS, pièce par pièce et en détail.",
      html: `<div class="page">
        ${pageHead(esc(D.collection.title), `<p>${n} pièces, en Onyx.</p><p>${val(D.collection.intro, "TEXTE DE PRÉSENTATION DE LA COLLECTION À RENSEIGNER")}</p>`)}
        <div class="cover">${img({ k: "cloud", pos: "50% 40%" }, "Silhouette de dos sous un ciel chargé, architecture de béton", { eager: true })}</div>
        <div>${D.products.map((p, i) => editorial(p, i, n)).join("")}</div>
        <section class="details" aria-labelledby="d-t">
          <h2 class="t2" id="d-t">Ce qu'on voit quand on s'approche.</h2>
          <div class="dgrid">${D.details.map(d => { const p = byId(d.product); return `<a class="d" href="#/piece/${p.id}">
            <div class="crop rv" style="aspect-ratio:${d.ratio}">${img(d.img, `${d.title}, gros plan`, { sizes: "(max-width:820px) 78vw, 50vw" })}</div>
            <p>${d.title}<span>${esc(title(p))}</span></p></a>`; }).join("")}</div>
        </section>
        <div class="endcta"><span class="t3">Le Drop 01 est au shop.</span><a class="btn" href="#/shop">Acheter</a></div>
      </div>`
    };
  },

  piece(q, id) {
    const p = byId(id); if (!p) return null;
    const others = D.products.filter(x => x !== p).slice(0, 3);
    return {
      title: `${title(p)} — ELYOS`,
      desc: `${p.category} ELYOS, coloris ${p.color}. Drop 01.`,
      nav: "shop",
      html: `<div class="page">
      <div class="pv">
        <div>
          <div class="pv__gal" id="gal">${p.images.map((r, j) => `<figure data-full="${r.k}">${img(r, `${title(p)}, vue ${j + 1}`, { sizes: "(max-width:900px) 100vw, 58vw", eager: j === 0 })}</figure>`).join("")}</div>
          <p class="pv__count" aria-live="polite"><span id="galN">1</span> / ${p.images.length}</p>
        </div>
        <div class="pv__info">
          <a class="back" href="#/shop">Retour au shop</a>
          <p class="pv__cat">${p.category}, Drop 01</p>
          <h1 class="t1">${esc(title(p))}</h1>${p.name ? "" : ph("NOM À RENSEIGNER")}
          <p class="pv__price">${price(p)}</p>
          <p class="pv__desc">${val(p.description, "DESCRIPTION À RENSEIGNER")}</p>
          <dl class="spec">
            <div><dt>Coloris</dt><dd>${p.color}</dd></div>
            <div><dt>Disponibilité</dt><dd>${val(p.status, "DISPONIBILITÉ À RENSEIGNER")}</dd></div>
            <div><dt>Détails</dt><dd><ul>${p.visible.map(v => `<li>${esc(v)}</li>`).join("")}</ul></dd></div>
          </dl>
          <div class="sz__lbl"><span id="szL">Taille</span><b id="szName">Choisir</b></div>
          <div class="sz" id="sz" role="group" aria-labelledby="szL">${D.sizes.map(s => `<button aria-pressed="false" data-size="${s}">${s}</button>`).join("")}</div>
          <button class="btn pv__add" data-add>Ajouter au panier</button>
          <p class="hint" id="hint" aria-live="polite"></p>
          <div class="pv__links"><a href="#/info/guide-des-tailles">Guide des tailles</a><a href="#/info/livraison-retours">Livraison et retours</a></div>
        </div>
      </div>
      <section class="more" aria-labelledby="more-t"><h2 class="t3" id="more-t">Du même drop</h2>
        <div class="more__grid">${others.map(o => card(o, "(max-width:820px) 64vw, 30vw")).join("")}</div></section>
      <div class="pv__bar"><span>${price(p)}</span><button class="btn" data-add>Ajouter au panier</button></div>
      </div>`,
      mount(root) {
        let size = null;
        $$("[data-size]", root).forEach(b => b.onclick = () => {
          size = b.dataset.size;
          $$("[data-size]", root).forEach(x => x.setAttribute("aria-pressed", x === b));
          $("#szName", root).textContent = size; $("#hint", root).textContent = "";
        });
        $$("[data-add]", root).forEach(b => b.onclick = () => {
          if (!size) {
            const sz = $("#sz", root); sz.classList.remove("err"); void sz.offsetWidth; sz.classList.add("err");
            $("#hint", root).textContent = "Choisis une taille pour ajouter la pièce.";
            sz.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
            return;
          }
          Cart.add(p, size);
          $("#hint", root).textContent = `Ajouté au panier : ${title(p)}, taille ${size}.`;
        });
        const gal = $("#gal", root);
        gal.addEventListener("scroll", () => { $("#galN", root).textContent = Math.round(gal.scrollLeft / gal.clientWidth) + 1; }, { passive: true });
        $$("figure", gal).forEach(f => f.onclick = () => Lightbox.open(D.assets[f.dataset.full].l));
      }
    };
  },

  maison() {
    const h = D.house;
    return {
      title: "Maison — ELYOS",
      desc: "ELYOS est née à deux : deux initiales, E et Y, fondues en un seul signe.",
      html: `<div class="page hs">
        <div class="hs__intro">
          <div><svg class="hs__mark" role="img" aria-label="Monogramme ELYOS"><use href="#mark"/></svg>
          <h1 class="t1">Deux initiales.<br>Un seul signe.</h1></div>
          <p>ELYOS est née à deux. Son nom rassemble les initiales de ses fondateurs, E et Y. Son monogramme les fond en une seule ligne brisée.</p>
        </div>
        <div class="hs__wide">${img({ k: "stairs", pos: "50% 40%" }, "Silhouette de dos dans un escalier de béton", { eager: true })}</div>
        <div class="hs__cols">
          <dl>
            <div><dt>Fondateurs</dt><dd>${val(h.founders, "NOMS À RENSEIGNER")}</dd></div>
            <div><dt>Vision</dt><dd>${val(h.vision, "VISION DE LA MARQUE À RENSEIGNER")}</dd></div>
            <div><dt>Le vêtement</dt><dd>${val(h.garment, "RAPPORT AU VÊTEMENT À RENSEIGNER")}</dd></div>
            <div><dt>Fabrication</dt><dd>${val(h.making, "MATIÈRES ET FABRICATION À RENSEIGNER")}</dd></div>
          </dl>
          <figure class="rv">${img({ k: "portrait" }, "Assis en hauteur sur un mur de béton", { sizes: "(max-width:820px) 75vw, 33vw" })}</figure>
        </div>
        <div class="slogans">${h.slogans.map(s => `<p>${esc(s)}</p>`).join("")}</div>
        <div class="endcta" style="margin:0"><span class="t3">Voir ce que ça donne porté.</span><a class="ul" href="#/collection">La collection</a></div>
      </div>`
    };
  },

  journal(q, id) {
    if (id) {
      const a = D.journal.find(x => x.id === id); if (!a) return null;
      return {
        title: `${a.title} — Journal ELYOS`,
        desc: `${a.title}. Journal ELYOS.`,
        nav: "journal",
        html: `<div class="page"><article>
          <header class="art__head">
            <a class="back" href="#/journal">Journal</a>
            <h1 class="t1">${esc(a.title)}</h1>
            <div class="art__meta"><p>${val(a.date, "DATE À RENSEIGNER")}</p><p>${val(a.intro, "TEXTE DE L'ARTICLE À RENSEIGNER")}</p></div>
          </header>
          <div class="art__seq">${a.images.map((r, i) => `<figure class="${r.layout}" data-full="${r.k}">${img(r, r.alt, { sizes: r.layout === "full" ? "100vw" : "(max-width:820px) 100vw, 66vw", eager: i === 0 })}</figure>`).join("")}</div>
          <footer class="art__foot">
            <div><h2>Pièces portées</h2>${a.worn.map(i => `<a class="ul" href="#/piece/${i}" style="display:inline-block;margin:4px 0">${esc(title(byId(i)))}</a><br>`).join("")}</div>
            <div><h2>Crédits</h2><p>${val(a.credits, "PHOTOGRAPHIE ET DIRECTION ARTISTIQUE À RENSEIGNER")}</p></div>
            <div><h2>Collection</h2><a class="ul" href="#/collection" style="display:inline-block">Voir le Drop 01</a></div>
          </footer>
        </article></div>`,
        mount(root) { $$("[data-full]", root).forEach(f => f.onclick = () => Lightbox.open(D.assets[f.dataset.full].l)); }
      };
    }
    return {
      title: "Journal — ELYOS",
      desc: "Séries, campagnes et coulisses ELYOS.",
      html: `<div class="page">
        ${pageHead("Journal", `<p>Séries, campagnes et coulisses.</p>`)}
        <div class="jlist">${D.journal.length ? D.journal.map(a => `
          <a class="jcard" href="#/journal/${a.id}">
            <div class="crop rv">${img(a.images[0], a.images[0].alt, { sizes: "(max-width:820px) 100vw, 66vw" })}</div>
            <div><h2 class="t2">${esc(a.title)}</h2><p>${val(a.date, "DATE À RENSEIGNER")}</p><span class="ul">Lire</span></div>
          </a>`).join("") : `<p class="shop__empty">Les premiers articles arrivent bientôt.</p>`}</div>
      </div>`
    };
  },

  contact() {
    const c = D.config;
    const link = (u, t, l) => u ? `<a class="ul" href="${u}" target="_blank" rel="noopener">${t}</a>` : ph(l);
    return {
      title: "Contact — ELYOS",
      desc: "Contacter ELYOS : commandes, collaborations, presse.",
      html: `<div class="page">
        ${pageHead("Contact", `<p>Une question sur une pièce, une commande ou une collaboration.</p>`)}
        <div class="ct">
          <div class="ct__info">
            <dl>
              <div><dt>E-mail</dt><dd>${c.contactEmail ? `<a class="ul" href="mailto:${c.contactEmail}">${c.contactEmail}</a>` : ph("E-MAIL DE CONTACT À RENSEIGNER")}</dd></div>
              <div><dt>Instagram</dt><dd>${link(c.instagram, "Instagram", "LIEN INSTAGRAM À RENSEIGNER")}</dd></div>
              <div><dt>TikTok</dt><dd>${link(c.tiktok, "TikTok", "LIEN TIKTOK À RENSEIGNER")}</dd></div>
              <div><dt>Délai de réponse</dt><dd>${val(c.replyDelay, "DÉLAI À RENSEIGNER")}</dd></div>
            </dl>
            <div class="ct__help"><h2>Réponses rapides</h2>
              <a href="#/info/livraison-retours">Livraison et retours</a><a href="#/info/guide-des-tailles">Guide des tailles</a><a href="#/info/cgv">Conditions de vente</a></div>
          </div>
          <form class="form" id="cform" novalidate>
            <div class="field"><label for="cf-n">Nom</label><input id="cf-n" name="name" autocomplete="name" required><small></small></div>
            <div class="field"><label for="cf-e">E-mail</label><input id="cf-e" name="email" type="email" autocomplete="email" required><small></small></div>
            <div class="field field--w"><label for="cf-s">Sujet</label><select id="cf-s" name="subject"><option>Une pièce ou une taille</option><option>Une commande</option><option>Une collaboration</option><option>Presse</option><option>Autre</option></select><small></small></div>
            <div class="field field--w"><label for="cf-m">Message</label><textarea id="cf-m" name="message" required></textarea><small></small></div>
            <div class="form__foot"><button class="btn" type="submit">Envoyer</button><p class="form__msg" id="cf-msg" aria-live="polite"></p></div>
          </form>
        </div>
      </div>`,
      mount(root) {
        const f = $("#cform", root), msg = $("#cf-msg", root);
        f.onsubmit = async e => {
          e.preventDefault();
          let ok = true;
          const check = (el, cond, m) => { const fld = el.closest(".field"); fld.classList.toggle("bad", !cond); $("small", fld).textContent = cond ? "" : m; if (!cond && ok) { el.focus(); ok = false; } };
          check(f.name, f.name.value.trim().length > 1, "Indique ton nom.");
          check(f.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim()), "Adresse e-mail invalide.");
          check(f.message, f.message.value.trim().length > 9, "Ton message est un peu court.");
          if (!ok) return;
          const data = Object.fromEntries(new FormData(f));
          if (c.contactEndpoint) {
            try { const r = await fetch(c.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!r.ok) throw 0;
              msg.textContent = "Message envoyé. On te répond au plus vite."; f.reset(); }
            catch (err) { msg.textContent = "L'envoi n'a pas abouti. Réessaie dans un instant."; }
          } else if (c.contactEmail) {
            location.href = `mailto:${c.contactEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message + "\n\n" + data.name + "\n" + data.email)}`;
          } else {
            msg.textContent = "Version de démonstration : le formulaire n’envoie rien. La marque est en pause.";
          }
        };
      }
    };
  },

  info(q, id) {
    const page = D.info[id]; if (!page) return null;
    let body;
    if (page.table) {
      body = `<div class="tw"><table><thead><tr><th>Taille</th><th>Tour de poitrine</th><th>Longueur</th><th>Tour de taille</th></tr></thead>
        <tbody>${D.sizes.map(s => `<tr><td>${s}</td><td>—</td><td>—</td><td>—</td></tr>`).join("")}</tbody></table></div>
        <p class="info__note">Mesures publiées à l’ouverture de la boutique.</p>`;
    } else {
      body = page.rows.every(([k, v]) => v == null) ? `<p>Ces informations seront publiées à l’ouverture de la boutique.</p>` : `<dl>${page.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${val(v, "À RENSEIGNER")}</dd></div>`).join("")}</dl>`;
    }
    return { title: `${page.title} — ELYOS`, desc: `${page.title}, ELYOS.`, nav: "",
      html: `<div class="page"><section class="info"><a class="back" href="#/">Accueil</a><h1 class="t1">${page.title}</h1>${body}</section></div>` };
  },

  notFound() {
    return {
      title: "Page introuvable — ELYOS", desc: "Cette page n'existe pas.",
      html: `<div class="page"><section class="nf">
        <div class="nf__img">${img({ k: "seatSun", pos: "55% 50%" }, "Silhouette assise dans le béton", { sizes: "40vw", eager: true })}</div>
        <div class="nf__txt"><h1 class="t1">Cette page n'existe pas.</h1><p>Le lien est peut-être incomplet, ou la page a été déplacée.</p>
        <nav><a class="ul" href="#/">Accueil</a><a class="ul" href="#/shop">Shop</a></nav></div>
      </section></div>`
    };
  }
};

/* ---------- Routeur ---------- */
let firstLoad = true;
const Router = (() => {
  const app = $("#app"), curtain = $("#curtain"), metaDesc = $('meta[name="description"]');
  const scrolls = {};
  let current = null, byClick = false, busy = Promise.resolve();

  function parse() {
    let h = location.hash || "#/";
    if (!h.startsWith("#/")) h = "#/";
    const [path, qs] = h.slice(2).split("?");
    const [type = "", id] = path.split("/").map(decodeURIComponent);
    const q = Object.fromEntries(new URLSearchParams(qs || ""));
    return { key: h, type, id, q };
  }
  function build(r) {
    const map = { "": "home", shop: "shop", collection: "collection", maison: "maison", journal: "journal", contact: "contact", piece: "piece", info: "info" };
    const fn = map[r.type];
    if (!fn || (["home", "shop", "collection", "maison", "contact"].includes(fn) && r.id)) return Pages.notFound();
    return Pages[fn](r.q, r.id) || Pages.notFound();
  }
  function render(page, r) {
    app.innerHTML = page.html;
    page.mount && page.mount(app);
    document.title = page.title;
    metaDesc && (metaDesc.content = page.desc || "");
    document.body.dataset.page = page.home ? "home" : "inner";
    const navKey = page.nav != null ? page.nav : r.type;
    $$("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav === navKey ? "page" : "false"));
    reveal(); Nav.refresh();
  }
  async function go() {
    const r = parse();
    if (current) scrolls[current] = scrollY;
    const page = build(r);
    const sameBase = current && current.split("?")[0] === r.key.split("?")[0];
    const target = byClick ? 0 : (scrolls[r.key] || 0);
    byClick = false;
    Menu.close(); Cart.close(true);
    if (firstLoad || reduce || sameBase) {
      render(page, r);
      if (!sameBase) scrollTo({ top: target, behavior: "instant" });
    } else {
      curtain.classList.add("in");
      await wait(430);
      render(page, r);
      scrollTo({ top: target, behavior: "instant" });
      curtain.classList.replace("in", "out");
      await wait(520);
      curtain.classList.remove("out");
    }
    if (!firstLoad && !sameBase) { app.focus({ preventScroll: true }); }
    firstLoad = false;
    current = r.key;
  }
  document.addEventListener("click", e => { const a = e.target.closest('a[href^="#/"]'); if (a) byClick = true; });
  addEventListener("hashchange", () => { busy = busy.then(go); });
  return {
    start: () => { busy = busy.then(go); },
    replace(h) { try { history.replaceState(null, "", h); } catch (e) { location.hash = h; return; } busy = busy.then(go); }
  };
})();

/* ---------- Panier ---------- */
const Cart = (() => {
  const el = $("#cart"), veil = $("#veil"), list = $("#cartList");
  let items = [], opener = null;
  try { items = JSON.parse(localStorage.getItem("elyos-cart") || "[]").filter(x => byId(x.id)); } catch (e) { items = []; }
  const save = () => { try { localStorage.setItem("elyos-cart", JSON.stringify(items)); } catch (e) {} };

  function render() {
    const n = items.reduce((a, b) => a + b.q, 0);
    $$("[data-count]").forEach(e => e.textContent = n);
    list.innerHTML = items.length ? items.map((c, i) => {
      const p = byId(c.id);
      return `<div class="line">
        <a class="crop" href="#/piece/${p.id}" aria-label="${esc(title(p))}">${img(p.images[0], "", { sizes: "72px" })}</a>
        <div>${esc(title(p))}<small>${p.color}, taille ${c.size}</small>
          <div class="line__qty"><button data-q="-1" data-i="${i}" aria-label="Retirer un exemplaire">−</button><span>${c.q}</span><button data-q="1" data-i="${i}" aria-label="Ajouter un exemplaire">+</button></div>
          <button class="line__rm" data-rm="${i}">Retirer</button></div>
        <div>${p.price == null ? ph("PRIX") : eur(p.price * c.q)}</div></div>`;
    }).join("") : `<p class="cart__empty">Ton panier est vide. <a class="ul" href="#/shop">Aller au shop</a></p>`;
    const unknown = items.some(c => byId(c.id).price == null);
    $("#cartTotal").innerHTML = unknown ? ph("À RENSEIGNER") : eur(items.reduce((a, c) => a + byId(c.id).price * c.q, 0));
    $("#checkout").disabled = !items.length;
    $("#cartMsg").textContent = "";
  }
  list.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.rm) items.splice(+b.dataset.rm, 1);
    else if (b.dataset.q) { const it = items[+b.dataset.i]; it.q += +b.dataset.q; if (it.q < 1) items.splice(+b.dataset.i, 1); }
    else return;
    save(); render();
  });
  function add(p, size) {
    const f = items.find(x => x.id === p.id && x.size === size);
    f ? f.q++ : items.push({ id: p.id, size, q: 1 });
    save(); render();
    const b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    open();
  }
  function open() {
    opener = document.activeElement;
    el.classList.add("open"); veil.classList.add("on");
    document.documentElement.classList.add("locked");
    setTimeout(() => $("#cartClose").focus(), 60);
  }
  function close(silent) {
    if (!el.classList.contains("open")) return;
    el.classList.remove("open"); veil.classList.remove("on");
    document.documentElement.classList.remove("locked");
    if (!silent && opener && opener.focus) opener.focus({ preventScroll: true });
  }
  $("#checkout").onclick = () => {
    if (D.config.checkoutUrl) { location.href = D.config.checkoutUrl; return; }
    $("#cartMsg").innerHTML = `La commande en ligne n'est pas encore ouverte. <button class="ul" id="toNews">Être prévenu</button>`;
    $("#toNews").onclick = () => { close(true); const m = $("#mail"); m.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); setTimeout(() => m.focus({ preventScroll: true }), 500); };
  };
  $("#cartClose").onclick = () => close(); veil.onclick = () => close();
  document.addEventListener("click", e => { if (e.target.closest("[data-open-cart], #cartBtn")) { e.preventDefault(); Menu.close(); open(); } });
  render();
  return { add, open, close, el };
})();

/* ---------- Navigation ---------- */
const Nav = (() => {
  const nav = $("#nav");
  let lastY = scrollY, ticking = false;
  function update() {
    ticking = false;
    const y = scrollY, hero = $(".hero"), home = document.body.dataset.page === "home";
    const h = hero ? hero.offsetHeight : 0;
    nav.classList.toggle("solid", !home || y > h - 80);
    if (y > Math.max(h, 200) && y > lastY + 6) nav.classList.add("hide");
    else if (y < lastY - 6 || y < Math.max(h, 200)) nav.classList.remove("hide");
    lastY = y;
    if (reduce) return;
    const hi = hero && $("img", hero);
    if (hi && y < h) hi.style.transform = `scale(1.06) translateY(${y * .18}px)`;
    const inter = $(".inter");
    if (inter) { const r = inter.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) $("img", inter).style.transform = `translateY(${(r.top / innerHeight) * -6}%)`; }
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  return { refresh() { lastY = scrollY; nav.classList.remove("hide"); update(); } };
})();

/* ---------- Menu mobile ---------- */
const Menu = (() => {
  const m = $("#menu"), b = $("#burger");
  const open = () => { m.classList.add("open"); b.setAttribute("aria-expanded", "true"); document.documentElement.classList.add("locked"); setTimeout(() => $("#menuClose").focus(), 60); };
  const close = () => {
    if (!m.classList.contains("open")) return;
    m.classList.remove("open"); b.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("locked");
  };
  b.onclick = open; $("#menuClose").onclick = () => { close(); b.focus(); };
  return { close, el: m };
})();

/* ---------- Visionneuse ---------- */
const Lightbox = (() => {
  const lb = $("#lb"); let opener = null;
  const close = () => { lb.classList.remove("on"); opener && opener.focus && opener.focus({ preventScroll: true }); };
  lb.onclick = close;
  return { open(src) { opener = document.activeElement; $("img", lb).src = src; lb.classList.add("on"); $("#lbClose").focus(); }, close, el: lb };
})();

/* ---------- Focus et Échap ---------- */
function trap(el) {
  el.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const f = $$('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])', el).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
}
[Cart.el, Menu.el, Lightbox.el].forEach(trap);
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if ($("#lb").classList.contains("on")) return Lightbox.close();
  if (Cart.el.classList.contains("open")) return Cart.close();
  if (Menu.el.classList.contains("open")) return Menu.close();
});
$("#skip").onclick = () => { const h = $("#app h1") || $("#app"); h.tabIndex = -1; h.focus(); };

/* ---------- Apparitions ----------
   On observe le parent : un élément entièrement masqué par son propre
   clip-path n'est jamais vu comme visible par IntersectionObserver. */
function reveal() {
  const map = new Map();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    (map.get(e.target) || []).forEach(el => el.classList.add("in"));
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px" });
  $$("#app .rv:not(.in)").forEach(el => {
    const p = el.parentElement;
    map.set(p, (map.get(p) || []).concat(el));
    io.observe(p);
  });
}

/* ---------- Newsletter (footer, commun à toutes les pages) ---------- */
$("#sub").onclick = async () => {
  const input = $("#mail"), msg = $("#newsMsg"), v = input.value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { msg.textContent = "Adresse invalide. Vérifie le format, par exemple toi@exemple.fr."; input.focus(); return; }
  const ep = D.config.newsletterEndpoint;
  if (!ep) { msg.textContent = "Version de démonstration : aucune inscription n’est enregistrée."; return; }
  try {
    const r = await fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: v }) });
    if (!r.ok) throw 0;
    msg.textContent = "Inscrit. Tu recevras un e-mail à l'ouverture du drop."; input.value = "";
  } catch (e) { msg.textContent = "L'inscription n'a pas abouti. Réessaie dans un instant."; }
};
$("#mail").addEventListener("keydown", e => { if (e.key === "Enter") $("#sub").click(); });

/* ---------- Footer : réseaux ---------- */
(() => {
  const c = D.config, col = $("#socialCol");
  col.insertAdjacentHTML("beforeend",
    (c.instagram ? `<a href="${c.instagram}" target="_blank" rel="noopener">Instagram</a>` : `<span>${ph("LIEN INSTAGRAM À RENSEIGNER")}</span>`) +
    (c.tiktok ? `<a href="${c.tiktok}" target="_blank" rel="noopener">TikTok</a>` : `<span>${ph("LIEN TIKTOK À RENSEIGNER")}</span>`));
  $("#year").textContent = new Date().getFullYear();
})();

Router.start();
})();

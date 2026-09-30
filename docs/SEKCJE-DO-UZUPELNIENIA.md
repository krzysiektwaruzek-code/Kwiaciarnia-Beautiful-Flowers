# Sekcje do uzupełnienia po otrzymaniu materiałów od klienta

Strona jest celowo krótka — zawiera tylko potwierdzone informacje. Poniżej gotowe szablony sekcji, które można wkleić do `index.html` **dopiero po otrzymaniu prawdziwych treści** (oznaczone komentarzem `MIEJSCE NA SEKCJĘ` w pliku). Wszystkie korzystają z istniejących klas, więc pasują do reszty strony.

Po dodaniu sekcji pamiętaj o:
- dodaniu linku w nawigacji (`<ul class="nav__list">`),
- zwiększeniu numeru wersji `?v=` przy `styles.css` i `main.js` (cache),
- uzupełnieniu JSON-LD (np. `image`, `sameAs`, `makesOffer`) **tylko** o potwierdzone dane,
- ponownym wygenerowaniu `og-image.png`, jeśli zmienią się dane kontaktowe.

---

## 1. Oferta (potrzebne: potwierdzona lista usług/produktów od klienta)

Wstaw między sekcją z kartami a `#odwiedz`:

```html
<section class="section" id="oferta" aria-labelledby="oferta-title">
  <div class="container">
    <p class="eyebrow reveal">Oferta</p>
    <h2 id="oferta-title" class="section__title reveal" style="--d:60ms">TYTUŁ Z TREŚCI OD KLIENTA</h2>
    <p class="section__lead reveal" style="--d:120ms">KRÓTKI OPIS OD KLIENTA</p>

    <div class="offer-grid">
      <article class="card reveal">
        <h3 class="card__value">NAZWA POZYCJI</h3>
        <p>OPIS POZYCJI (bez wymyślonych cen i obietnic)</p>
      </article>
      <!-- kolejne karty -->
    </div>
  </div>
</section>
```

Dodaj do `styles.css` (sekcja 8. Karty):

```css
.offer-grid { display: grid; gap: 1.25rem; margin-top: 2.5rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
.offer-grid .card p { color: var(--c-muted); }
```

## 2. Galeria (potrzebne: prawdziwe zdjęcia kwiaciarni/realizacji i zgoda na ich użycie)

Zdjęcia: eksport do WebP, szerokość max ~1600 px, jakość ~80, do `assets/img/`. **Zawsze** podawaj `width`, `height` (stabilny układ) i sensowny `alt` opisujący to, co faktycznie widać.

```html
<section class="section section--tint" id="galeria" aria-labelledby="galeria-title">
  <div class="container">
    <p class="eyebrow reveal">Galeria</p>
    <h2 id="galeria-title" class="section__title reveal" style="--d:60ms">Zdjęcia z kwiaciarni</h2>
    <ul class="gallery">
      <li class="reveal"><img src="assets/img/NAZWA.webp" alt="OPIS TEGO, CO WIDAĆ" width="1200" height="800" loading="lazy" decoding="async"></li>
    </ul>
  </div>
</section>
```

```css
.gallery { display: grid; gap: 1rem; margin-top: 2.5rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr)); }
.gallery img { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius-md); }
```

Pierwszy obraz widoczny bez przewijania (np. w hero) **nie** powinien mieć `loading="lazy"`.

## 3. Opinie (tylko prawdziwe, z pozwoleniem autora lub w formie linku do źródła)

Nie wpisuj opinii „z pamięci" ani parafrazy. Najbezpieczniej: przycisk „Zobacz opinie w Google" prowadzący do wpisu, np. w sekcji „Odwiedź nas":

```html
<a class="btn btn--outline btn--sm" href="https://www.google.com/maps?cid=4791176426471529867" target="_blank" rel="noopener">Zobacz opinie w Google Maps</a>
```

Cytaty i ocenę (`aggregateRating` w JSON-LD) dodawaj wyłącznie z aktualnych, zweryfikowanych danych wpisu.

## 4. O kwiaciarni (potrzebny: opis od klienta)

Krótka sekcja tekstowa (2–3 akapity) w dokładnie takim brzmieniu, jakie zaakceptuje klient — bez dopisywania historii, doświadczenia czy statystyk, których klient nie potwierdził.

## 5. Osobne podstrony usług

Dopiero gdy klient dostarczy realną, szczegółową ofertę. Dla każdej podstrony: osobny plik `.html` (np. `bukiety-slubne.html`), własne `<title>`, `description`, canonical, wpis w `sitemap.xml` i linkowanie z sekcji „Oferta".

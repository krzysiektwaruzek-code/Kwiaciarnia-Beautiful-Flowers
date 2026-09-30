# Kwiaciarnia Beautiful Flowers — strona internetowa

Statyczna strona-wizytówka (HTML + CSS + JavaScript, bez frameworków i bez kroku budowania) dla kwiaciarni w Gdańsku, przy ul. Cedrowej 40. Gotowa do wgrania na Hostinger.

> **Zasada projektu: zero zmyślania.** Na stronie są wyłącznie potwierdzone informacje (nazwa, adres, telefon, godziny). Brak zdjęć, opinii, cen i opisu oferty jest celowy — nic z tego nie zostało potwierdzone. Pełny rejestr: [`docs/FAKTY.md`](docs/FAKTY.md).

## ⚠️ Przed publikacją

1. **Zweryfikuj dane z wpisem Google Maps** — research powstał bez dostępu do Map (zablokowane w środowisku), na podstawie wyników wyszukiwarki. Lista kontrolna: [`docs/FAKTY.md`](docs/FAKTY.md).
2. **Ustaw domenę** (canonical, Open Graph, JSON-LD, sitemap, robots):
   ```bash
   ./scripts/set-domain.sh https://twoja-domena.pl
   ```
   Skrypt zastępuje znacznik `{{SITE_URL}}`. Do tego czasu adresy w tych miejscach zawierają placeholder.
3. **Podłącz formularz kontaktowy** (patrz niżej) albo usuń sekcję formularza.
4. Włącz SSL w panelu Hostingera i odkomentuj przekierowanie HTTPS w `.htaccess`.

## Struktura

```
index.html                 strona główna (one-page)
404.html                   strona błędu 404
robots.txt, sitemap.xml    SEO (wymagają set-domain.sh)
.htaccess                  kompresja, cache, nagłówki bezpieczeństwa, 404 (Hostinger)
assets/css/styles.css      style: tokeny kolorów/typografii na górze pliku (:root)
assets/js/main.js          skrypty; obiekt CONFIG na początku pliku
assets/fonts/              Fraunces + Manrope (licencja OFL), hostowane lokalnie
assets/img/                favicon.svg, apple-touch-icon.png, og-image.png
docs/FAKTY.md              rejestr faktów, źródła, lista kontrolna
docs/SEKCJE-DO-UZUPELNIENIA.md   gotowe szablony: oferta, galeria, opinie
scripts/set-domain.sh      ustawienie domeny
```

## Uruchomienie lokalne

```bash
npx serve .            # albo: python3 -m http.server 8080
```

Nie otwieraj `index.html` bezpośrednio z dysku (`file://`) — przeglądarki blokują wtedy lokalne fonty (CORS) i strona wygląda inaczej niż na serwerze. Używaj lokalnego serwera jak wyżej.

## Wdrożenie na Hostingerze

Wystarczy hosting statyczny — wgraj **zawartość repozytorium** do katalogu `public_html` (bez `.git`, `docs/`, `scripts/`, `README.md` — nie są potrzebne na serwerze):

- **Menedżer plików / FTP** — przeciągnij `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `.htaccess` i folder `assets/`.
- **Git w hPanel** (Zaawansowane → Git) — podłącz to repozytorium do `public_html`.

Po wdrożeniu: dodaj stronę w Google Search Console i wyślij `sitemap.xml`.

## Formularz kontaktowy

To sam frontend — walidacja i komunikaty działają, ale **wysyłka nie jest podpięta**, bo nie podano adresu e-mail ani usługi. Dopóki atrybut `data-endpoint` jest pusty, formularz uczciwie informuje, że wiadomość nie została wysłana (i podaje numer telefonu), zamiast udawać sukces.

Aby uruchomić wysyłkę, wpisz adres usługi w `index.html`:

```html
<form class="form" data-contact-form data-endpoint="https://…" method="post" novalidate>
```

Skrypt wysyła `POST` (`FormData`, nagłówek `Accept: application/json`) i traktuje odpowiedź 2xx jako sukces. Pola: `name`, `contact`, `message`, `consent`, pułapka antyspamowa `_gotcha`. Pasują np. usługi typu Formspree lub Web3Forms albo własny skrypt PHP na Hostingerze. **Adres odbiorcy podaje klient.**

Uwaga prawna: zbieranie danych przez formularz wymaga klauzuli informacyjnej / polityki prywatności — to treść, którą dostarcza klient.

## Co jest w środku (decyzje projektowe)

- **Jedna strona zamiast serwisu** — potwierdzonych informacji jest za mało na sensowne podstrony. Puste lub sztuczne podstrony byłyby gorsze niż jedna dopracowana.
- **Bez zdjęć** — wizualnie prowadzi typografia (Fraunces + Manrope), geometryczny „kwiat" z SVG, gradienty, delikatna siatka i ziarno. Nic nie jest zdjęciem ani grafiką AI.
- **Wydajność** — brak bibliotek i frameworków; JS ok. 4 KB po kompresji gzip, CSS ok. 7 KB; fonty lokalne (wariable, `font-display: swap`, preload); animacje tylko `transform`/`opacity`; mapa Google ładuje się **dopiero po kliknięciu** (szybciej i bez cookies Google przy wejściu).
- **Dostępność** — link „Przejdź do treści", widoczny focus, obsługa klawiaturą (w tym Esc w menu), `aria-*`, etykiety pól, komunikaty błędów powiązane z polami, kontrast zgodny z WCAG AA, `prefers-reduced-motion`.
- **SEO lokalne** — JSON-LD typu `Florist` wyłącznie z potwierdzonymi danymi (adres, telefon, godziny, link do Map), poprawne `title`/`description`/canonical/Open Graph/Twitter Cards, semantyczne nagłówki.
- **Godziny** — dzisiejszy dzień i status „Teraz otwarte/zamknięte" liczone w czasie polskim. Dni nieczynne (święta) dopisz w `closedDates` w `assets/js/main.js`.

## Zmiana danych firmy

Dane występują w kilku miejscach — lista i komenda `grep` w [`docs/FAKTY.md`](docs/FAKTY.md).

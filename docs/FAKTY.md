# Rejestr faktów — co jest na stronie i skąd to wiadomo

Zasada projektu: **na stronie jest tylko to, co udało się potwierdzić.** Poniżej pełna lista faktów użytych w kodzie, wraz ze źródłem i statusem weryfikacji. Wszystkie pozostałe informacje zostały świadomie pominięte.

## Jak przeprowadzono research

Wpis w Google Maps (`cid=4791176426471529867`) **nie był dostępny** — środowisko, w którym powstała strona, blokowało domeny `google.com`, `maps.google.com`, `facebook.com`, `wolt.com` i `kwiatyyy.pl`. Dane pochodzą więc z **podsumowań wyników wyszukiwarki** (kilka zapytań; streszczenia generuje to samo narzędzie, więc zgodność wyników nie jest w pełni niezależnym potwierdzeniem), a nie z otwartego wpisu w Mapach ani z oficjalnej strony firmy. Wskazanie, że chodzi o firmę w **Gdańsku**, pochodzi od zleceniodawcy.

## Fakty użyte na stronie

| Informacja | Wartość | Źródło | Status |
|---|---|---|---|
| Nazwa | Kwiaciarnia Beautiful Flowers | Wyniki wyszukiwarki (m.in. wpis na Facebooku o tej nazwie), nazwa repozytorium | Spójne we wszystkich zapytaniach. **Zweryfikować z wpisem Google Maps.** |
| Rodzaj działalności | Kwiaciarnia | Wynika z nazwy | Pewne |
| Adres | ul. Cedrowa 40, 80-126 Gdańsk | 3 zapytania do wyszukiwarki | Spójne. **Zweryfikować z Mapą.** Uwaga: katalog Targeo wymienia pod tym adresem także „Kwiaciarnię Dragonfly" — sprawdzić, czy adres jest aktualny. |
| Telefon | 509 396 670 (w linkach `+48509396670`) | 2 zapytania do wyszukiwarki | Spójne. **Zweryfikować z Mapą.** Prefiks +48 to standard krajowy. |
| Godziny otwarcia | poniedziałek–niedziela, 8:00–18:00 | 3 zapytania do wyszukiwarki | Spójne. **Zweryfikować z Mapą**, w tym godziny w dni świąteczne (patrz niżej). |
| Link do Google Maps | `https://www.google.com/maps?cid=4791176426471529867` | Przekazany przez zleceniodawcę | Pewne (podany wprost) |

Gdzie te dane występują w kodzie (przy zmianie edytować **wszystkie** miejsca):

- `index.html` — `<title>`, meta description, Open Graph, Twitter, JSON-LD, hero, karty, sekcja „Odwiedź nas", „Kontakt", stopka, pasek mobilny
- `assets/js/main.js` — obiekt `CONFIG` (godziny, telefon do komunikatów)
- `assets/img/og-image.png` — grafika z adresem, telefonem i godzinami (wygenerowana z typografii; przy zmianie danych wygenerować ponownie)
- `404.html` — bez danych firmy poza nazwą

Szybka kontrola: `grep -rn "509\|Cedrowa\|8:00" --include=*.html --include=*.js .`

## Świadomie POMINIĘTE (niepotwierdzone lub sprzeczne)

| Informacja | Dlaczego pominięto |
|---|---|
| Oceny i liczba opinii | Zapytania dały sprzeczne wyniki (4,9 w jednym, 5,0 z 10 głosami w innym). Nie użyto też żadnych treści opinii. |
| Opis oferty (bukiety, kompozycje, wieńce, dostawa) | Pojawia się tylko w opisach katalogowych widzianych w streszczeniach wyszukiwarki, bez dostępu do źródła. Nie ma potwierdzenia, że dotyczy tej firmy. |
| Ceny, promocje, gwarancje, certyfikaty | Brak jakichkolwiek danych. |
| Zdjęcia i logo | Nie znaleziono dostępnych, potwierdzonych materiałów. Nic nie zostało wygenerowane ani wzięte ze stocków. Strona opiera się na typografii i geometrycznej dekoracji. |
| Profil na Facebooku | Wyszukiwarka zwraca stronę „Kwiaciarnia Beautiful Flowers", ale nie dało się jej otworzyć, by potwierdzić, że to ta sama firma (istnieje też inna firma o zbliżonej nazwie w Krakowie). Po weryfikacji można dodać link w stopce i `sameAs` w JSON-LD. |
| Adres e-mail, właściciel, zespół, historia, doświadczenie | Brak danych. |
| Współrzędne GPS, dzielnica | Niepotwierdzone — nie ma ich w JSON-LD (`geo`). Mapa i trasa korzystają z adresu tekstowego. |

## Elementy neutralne (nie są „faktami o firmie")

- **Favicon i ikona Apple** — proste, geometryczne kwiatowe motywy dekoracyjne, **nie logo firmy**. Wymienić na prawdziwe logo, gdy klient je dostarczy.
- **Nagłówek strony** — sam tekst („Beautiful Flowers"), nie logotyp.
- **Wskaźnik „Teraz otwarte / zamknięte"** — obliczany wyłącznie z godzin powyżej (czas polski). Nie uwzględnia świąt, dopóki nie uzupełnisz `closedDates` w `assets/js/main.js`.
- **Zgoda w formularzu** — ogólne sformułowanie o kontakcie w sprawie wiadomości. Pełna klauzula informacyjna RODO / polityka prywatności to treść prawna, którą powinien dostarczyć klient.

## Lista kontrolna przed publikacją

1. Otworzyć wpis Google Maps i porównać: nazwa, adres, telefon, godziny (także święta) → poprawić kod, jeśli się różnią.
2. Uzupełnić `closedDates` (dni nieczynne) w `assets/js/main.js`, jeśli klient je poda.
3. Zapytać klienta o zdjęcia, ofertę, e-mail do formularza, logo, profile social media.

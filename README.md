# BNI Memel svetainės peržiūra

Statinė Astro svetainė pagal patvirtintą BNI Memel maketą. Išlaikyti maketo tekstai, išdėstymas, penkios autentiškos klubo nuotraukos ir balta, juoda bei BNI raudona spalvos. Piktogramos surenkamos iš užfiksuotos `lucide` bibliotekos; išorinio CDN nereikia.

## Paleidimas

Reikia Node.js 24 ir npm.

```sh
npm ci
npm run dev
```

Pagal numatytą konfigūraciją atverti terminale pateiktą vietinį adresą su `/bnimemel-site/` keliu.

```sh
npm run build
npm run verify
npm run preview
```

Paruošta svetainė sukuriama `dist/` kataloge. `verify` tikrina dešimt puslapių, nuotraukas, nuorodų tikslus, failų kelius, spalvas ir demonstracinių formų apsaugas.

## Puslapiai ir nuorodos

Puslapiai veikia per URL fragmentus ir naršyklės „Atgal / Pirmyn“ mygtukus:

| Puslapis | URL fragmentas |
| --- | --- |
| Pradžia | `#home` |
| Apie klubą | `#about` |
| Nariai | `#members` |
| Nario profilis | `#profile/nario-id` |
| Apsilankymas | `#visit` |
| Narystė | `#membership` |
| Istorijos | `#stories` |
| Istorija | `#story/0` (0–2) |
| Kontaktai | `#contact` |
| Privatumas | `#privacy` |

Galima pasidalyti bet kurio rodinio adresu nukopijavus naršyklės URL. Narių katalogas turi vardo, įmonės ir veiklos srities paiešką (su lietuviškomis raidėmis arba be jų) bei iš oficialių duomenų sudaromą veiklos srities filtrą. Narių puslapio viršuje atskirai pristatomi trys vadovybės nariai; jie taip pat lieka visame narių kataloge. Ta pati vadovybė rodoma puslapyje „Apie klubą“. Narių profilių nuorodos naudoja stabilius ID; ankstesni skaitiniai profilio adresai taip pat veikia.

## Diegimas į GitHub Pages

Numatytas projektas: `ajocys86-source/bnimemel-site`. Numatytoji peržiūros nuoroda po sėkmingo diegimo: `https://ajocys86-source.github.io/bnimemel-site/`.

1. Įkelti projektą į GitHub saugyklos `main` šaką.
2. Saugyklos **Settings → Pages → Source** pasirinkti **GitHub Actions**.
3. `.github/workflows/deploy.yml` surinks, patikrins ir paskelbs `dist/` po kiekvieno `main` pakeitimo. Diegimą galima pradėti ir rankiniu būdu per **Actions**.

Workflow automatiškai naudoja saugyklos pavadinimą kaip pagrindinį URL kelią. Kitam statiniam talpinimui ar nuosavam domenui galima rinkti taip:

```sh
BASE_PATH=/ npm run build
npm run verify
```

Tuomet publikuoti visą `dist/` turinį. Numatytoji `astro.config.mjs` reikšmė yra `/bnimemel-site`.

## Failų struktūra

- `src/pages/index.astro` – HTML dokumentas, metaduomenys ir surinkimas.
- `src/content/approved.html` – patvirtinto maketo turinys ir dešimt rodinių.
- `src/data/members.json` – oficialaus BNI Memel sąrašo narių vardai, įmonės, veiklos sritys, oficialių profilių ir nuotraukų šaltiniai.
- `src/data/leadership.json` – oficialiame klubo puslapyje patikrintos vadovybės pareigos ir ryšys su narių profiliais.
- `src/scripts/site.js` – navigacija, profiliai, istorijos, filtrai ir vietinės formų demonstracijos.
- `public/styles.css` – originali patvirtinto maketo stilių seka.
- `public/assets/` – klubo nuotraukos, logotipas ir jų šaltinių sąrašas `sources.json`; `members/` – 32 klubo pateiktos „Canva“ prezentacijos portretai, paruošti svetainei. Prezentacijos redagavimo nuoroda viešai neskelbiama. Nuotraukų šaltinių skaidrės ir versijos saugomos narių duomenyse.

## Peržiūros ribos

Tai dizaino peržiūra su `noindex,nofollow`. Svečių registracija ir žinutės vadovams nukreipiamos į oficialią BNI sistemą. Svetainėje nėra vietinių duomenų įvedimo formų. Vadovybė, susitikimų vieta, laikas ir vieši vadovų telefonai patikrinti oficialiame klubo puslapyje 2026-11-06. Dalyvavimo mokestį ir pasirinktos datos programą svečias turi pasitikslinti su klubu. Visi 32 dabartiniai nariai turi klubo pateiktus portretus. Dvi istorijų temos – redakciniai pavyzdžiai. Analitika ir sekimas neįdiegti.

## Veikianti svečių registracija ir kontaktai

Svečiai registruojasi oficialioje BNI sistemoje: https://bni.lt/lt/visitorregistration?chapterId=22056. Vietinės demonstracinės registracijos ir užklausos formos pašalintos. Susitikimai: trečiadieniais 6:45, AURORA HOTEL KLAIPĖDA, Nemuno g. 51, Klaipėda 91190. Pateikti oficialūs trijų vadovų telefonai bei BNI žinučių nuorodos. Šaltinis https://bni.lt/lietuva-bni-memel/lt/index, patikrinta 2026-11-06. Registracijos pateikimas tikrinant neatliekamas – nesiunčiami bandomi svečiai.

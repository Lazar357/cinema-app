# Dokumentacija Projekta: Car Service Management System

Ovaj sistem je web aplikacija namenjena auto-servisima za upravljanje klijentima, njihovim vozilima, zalihama delova (artiklima) i izdavanjem faktura.

## 1. Tehnološki Stack

### Backend
- **Runtime:** Node.js / Bun
- **Framework:** Express.js (v5)
- **Jezik:** TypeScript
- **ORM:** TypeORM (za rad sa bazom podataka preko objekata)
- **Baza podataka:** MariaDB / MySQL
- **Autentifikacija:** JWT (JSON Web Token) i `bcrypt` za sigurnost lozinki.

### Frontend
- **Framework:** Vue.js 3 (Composition API)
- **Build Alat:** Vite
- **Jezik:** TypeScript
- **Dizajn:** Bootstrap 5 (za responsive UI), FontAwesome (za ikone).
- **Routing:** Vue Router 5
- **Komunikacija:** Axios (HTTP klijent za API pozive).

---

## 2. Arhitektura Baze Podataka

Baza podataka se sastoji od sledećih ključnih entiteta:

- **User:** Zaposleni u servisu (sa ulogama administratora ili običnog korisnika).
- **Client:** Vlasnici vozila (ime, prezime, kontakt podaci).
- **Model:** Marka i model automobila.
- **Vehicle:** Konkretno vozilo (povezano sa klijentom i modelom, sadrži VIN i registraciju).
- **Article:** Rezervni delovi ili servisne usluge sa definisanom cenom.
- **Invoice:** Faktura izdata za određeno vozilo.
- **InvoiceArticle:** Stavke na fakturi (povezuje konkretne artikle sa fakturama, uz cenu i popust u trenutku prodaje).

### Relacije:
- Klijent može imati više vozila.
- Vozilo pripada jednom klijentu i jednom modelu.
- Vozilo može imati više faktura kroz istoriju servisiranja.
- Faktura se sastoji od više artikala (stavki).

---

## 3. Backend Dokumentacija

### API Rute (`/api`)
Sve rute osim `/api/user/login` zahtevaju `Authorization` header sa validnim JWT tokenom.

#### Autentifikacija i Korisnici (`/api/user`)
- `POST /login` - Prijava na sistem.
- `POST /` - Kreiranje novog korisnika (samo za administratore).
- `GET /me` - Podaci o trenutno ulogovanom profilu.

#### Upravljanje Podacima
- **Klijenti (`/api/client`):** Pregled svih, detalji, unos novog, izmena i brisanje.
- **Vozila (`/api/vehicle`):** Lista vozila, unos novog (povezivanje sa klijentom), izmena podataka.
- **Artikli (`/api/article`):** Katalog delova i usluga.
- **Fakture (`/api/invoice`):** Kreiranje faktura, dodavanje stavki, finalizacija i pregled istorije po vozilu.

---

## 4. Frontend Dokumentacija

### Organizacija Projekta
- `src/views/` - Sadrži stranice aplikacije (Liste, Forme za unos/izmenu).
- `src/services/` - Logika za komunikaciju sa backendom (npr. `auth.service.ts`, `client.service.ts`).
- `src/router/` - Definisanje putanja i zaštita (npr. preusmeravanje na Login ako korisnik nije ulogovan).
- `src/models/` - TypeScript interfejsi koji osiguravaju da podaci na frontendu prate strukturu baze.

### Zaštita Ruta
Aplikacija koristi `Navigation Guards` kako bi osigurala da:
1. Neulogovani korisnici mogu videti samo Login stranicu.
2. Samo administratori mogu pristupiti stranici za registraciju novih zaposlenih.

---

## 5. Instalacija i Pokretanje

### 1. Korak: Baza Podataka
Kreirajte bazu podataka (npr. `fir_rs_2025`) u vašem MariaDB/MySQL okruženju.

### 2. Korak: Backend
1. Navigirajte u direktorijum `backend/`.
2. Instalirajte zavisnosti: `npm install` (ili `bun install`).
3. Kreirajte `.env` fajl sa sledećim varijablama:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=vas_korisnik
   DATABASE_PASSWORD=vasa_lozinka
   DATABASE_NAME=fir_rs_2025
   SERVER_PORT=4800
   JWT_SECRET=neka_tajna_rec
   ```
4. Pokrenite server: `npm run dev`.

### 3. Korak: Frontend
1. Navigirajte u direktorijum `frontend/`.
2. Instalirajte zavisnosti: `npm install`.
3. Pokrenite aplikaciju: `npm run dev`.
4. Otvorite browser na: `http://localhost:5173`.

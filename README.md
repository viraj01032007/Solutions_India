# Solutions India — website (React + Vite)

## Run locally
```
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173).

## Build for hosting
```
npm run build
```
Upload the `dist/` folder to any static host (Vercel, Netlify, Hostinger, cPanel...).

## Admin panel
Footer → **Admin** (or open `/#admin`).
- Password: `Reimagine@2026`
- Security PIN: `1234`
Both can be changed inside the panel (Admin login block → Save).

## Where things live
| File | What |
|---|---|
| `src/content.js` | Every default word and number on the site |
| `src/site.jsx` | Public site: hero, stats, timeline, programs, finder, contact, all animations |
| `src/admin.jsx` | Login + admin editor + enquiries list |
| `src/store.js` | Storage layer (see note below) |
| `src/styles.css` | All styling (colours in `:root`, dark mode included) |

## Important: storage
`src/store.js` saves admin edits and enquiries in the browser's **localStorage**.
That means they are visible only on the device/browser where they were made.
To make edits and enquiries work across devices, connect `store.js` to a backend
(Firebase, Supabase, or your own API) — it is the only file to change; the rest of
the site talks to it through `doc().get/set/onSnapshot` and `collection().onSnapshot`.

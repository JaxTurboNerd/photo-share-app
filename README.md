# Frame — photo sharing app

A mobile-first photo sharing SPA built with React + Vite + Tailwind, backed by Appwrite.

## Design

Light, editorial gallery style inspired by Squarespace's Nevins template: off-white canvas,
staggered masonry grid, full-screen lightbox on click, minimal chrome.

## Stack

- React 18 (JavaScript, not TypeScript)
- Vite — dev server / bundler
- Tailwind CSS — styling
- react-photo-album — responsive masonry grid
- yet-another-react-lightbox — full-screen photo viewer
- Appwrite — auth, database, file storage

## Getting started

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Appwrite project values (see below), then:

```bash
npm run dev
```

The app currently renders with placeholder photos (`src/data/placeholderPhotos.js`) so you can
see the UI immediately, even before Appwrite is connected.

## Setting up Appwrite

1. Create a project at [cloud.appwrite.io](https://cloud.appwrite.io) (or your self-hosted instance).
2. Add a **Web platform** to the project with your dev URL (e.g. `http://localhost:5173`).
3. Create a **Storage bucket** (e.g. `photos`) for the uploaded image files.
4. Create a **Database**, then a **Collection** inside it (e.g. `photos`) with these attributes:
   - `fileId` (string) — the Storage file ID
   - `caption` (string, optional)
   - `createdAt` (datetime)
   - `userId` (string, optional — once auth is added)
5. Set collection permissions to allow create/read for the access level you want (e.g. "Any" for
   read, "Users" for create, once auth is wired up).
6. Copy the Project ID, Database ID, Collection ID, and Bucket ID into `.env`.

## Project structure

```
src/
  components/
    Header.jsx        — top bar with wordmark
    PhotoGrid.jsx      — masonry gallery grid
    Lightbox.jsx       — full-screen photo viewer
    UploadButton.jsx   — floating action button
    UploadModal.jsx    — file picker + Appwrite upload logic
  data/
    placeholderPhotos.js — sample data, remove once Appwrite is live
  lib/
    appwrite.js        — Appwrite client + config
  App.jsx
  main.jsx
  index.css
```

## Next steps

- Replace `placeholderPhotos` with a live fetch from Appwrite Databases on mount
- Add Appwrite Auth (email/OAuth) so uploads are tied to a user
- Add infinite scroll / pagination for the gallery as the photo count grows
- Deploy: Appwrite supports static site hosting, or deploy the built `dist/` folder to any
  static host (Vercel, Netlify, Appwrite Sites) and point it at your Appwrite project endpoint

# Rinnu ♥ Kanu — Couple Companion App

A beautiful couple's daily companion app with trackers, sweet activities, and more.

## Features

- **Today** — Mood tracker, daily schedule, evening routine checklist, love notes
- **Week** — Full weekly timetable with college times and stay/home plans
- **Sweet** — Daily couple question, sweet activity tracker, date jar, couple stats
- **Track** — Individual habit trackers with progress rings, streaks, weekly heatmap
- **Us** — Anniversary countdown, milestone tracker, promises, wishlist, couple journal

All data is saved to your phone's local storage — it persists between visits!

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` on your phone (same WiFi network).

## Deploy to Phone (Free)

### Option 1: Vercel (Recommended — easiest)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com), sign in with GitHub
3. Click "New Project" → Select this repo
4. Click "Deploy" — done!
5. Open the URL on your phone and tap "Add to Home Screen"

### Option 2: Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com), sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select repo, build command: `npm run build`, publish directory: `dist`
5. Deploy! Open URL on phone and add to home screen.

### Option 3: GitHub Pages

1. Install: `npm install -D gh-pages`
2. Add to package.json scripts: `"deploy": "npm run build && npx gh-pages -d dist"`
3. Run: `npm run deploy`
4. Enable Pages in repo settings (source: gh-pages branch)

## Add to Home Screen (PWA)

After deploying, open the site on your phone:
- **iPhone**: Tap Share → "Add to Home Screen"
- **Android**: Tap the menu (⋮) → "Add to Home Screen" or "Install App"

It will look and feel like a real app!

## Customize

### Change Schedule
Edit `SCHEDULE` in `src/App.jsx`:
```js
const SCHEDULE = {
  Mon: { college: true, stay: 'stay' },    // stay = stay together
  Tue: { college: true, stay: 'house' },   // house = go to house
  ...
  Sun: { college: false, stay: 'home' },   // home = go home
};
```

### Change Habits
Edit `HABITS` array in `src/App.jsx`.

### Change Names
Find & replace "Rinnu" and "Kanu" in `src/App.jsx`.

### Add App Icon
Replace `public/icon.svg` with your own couple photo (also add `icon-192.png` and `icon-512.png`).

## Tech Stack

- React 18 + Vite
- No external UI libraries — pure CSS
- localStorage for persistence
- PWA-ready with manifest

---

Made with love 💕

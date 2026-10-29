# Repository notes

- This is a single Expo 54 / Expo Router app (npm lockfile; no workspace). Install with `npm ci`, run with `npm start`; `npm run ios`, `npm run android`, and `npm run web` use the scripts in `package.json`.
- Verification: `npm run lint` (`expo lint`); focus on one file with `npx eslint 'app/(tabs)/MapPage.tsx'`; typecheck with `npx tsc --noEmit`. There is no test script or test suite configured.
- Do **not** run the README's `npm run reset-project`: its target `scripts/reset-project.js` is absent.
- Never leave comments. Code should be self-explanatory.
- Always verify AGENTS.md after doing anything to see if you need to add or remove anything from here.

## App wiring

- `package.json` enters through `expo-router/entry`. `app/index.tsx` redirects to `/(auth)/Welcome`; its Login button navigates to `/(tabs)/FeedPage` without an auth backend. `app/_layout.tsx` loads Silkscreen fonts and wraps all routes in the Redux provider and gesture-handler root.
- `app/(tabs)/_layout.tsx` hides the default tab bar and renders `components/Navbar.tsx`; the navbar explicitly routes to Feed, Map, and Profile even though only Feed is declared in the Tabs layout. Standalone screens such as Camera and Quiz live directly under `app/`.
- Redux state in `store/` uses `mocks/` for initial roads, places, and user; leaderboard data is seeded from mocks on demand. Most app data is local, not fetched. The camera flow is different: `actions/camera.ts` posts photos to `/verify-location` using the hard-coded ngrok `apiUrl` in `environment.ts`. Check that endpoint before relying on photo verification.
- `app/(tabs)/MapPage.tsx` renders `AppleMaps.View` from `expo-maps` (Apple-specific); do not assume the map works on Android or web. Map/Feed landmark images are resolved via separate static `IMAGE_MAP` require tables in their respective screens; update both tables when adding photo filenames to mock roads.

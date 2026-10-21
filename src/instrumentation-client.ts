// Runs once on the client before the app becomes interactive (Next.js instrumentation-client),
// so Amplitude & Firebase Analytics are initialized exactly once per page load.
import * as amplitude from '@amplitude/unified';
import { getFirebaseAnalytics, logFirebaseEvent } from '@/lib/firebase';

// Amplitude ingestion key — public by design; move to an env var when you set up environments.
const AMPLITUDE_API_KEY = 'dc827971b83b7855a855679307cb39c1';

amplitude.initAll(AMPLITUDE_API_KEY, {"analytics":{"autocapture":true},"sessionReplay":{"sampleRate":1}});

// Initialize Firebase Analytics on client load
getFirebaseAnalytics().then(() => {
  logFirebaseEvent('app_initialized', { app_name: 'mandar_portfolio' });
});

// The portfolio is a single page (src/app/page.tsx), so every load is a home page view.
amplitude.track('Viewed Home Page', { prompt_version: 'BA400.4' });
logFirebaseEvent('view_home_page', { prompt_version: 'BA400.4' });

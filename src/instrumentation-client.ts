// Runs once on the client before the app becomes interactive (Next.js instrumentation-client),
// so Amplitude is initialized exactly once per page load.
import * as amplitude from '@amplitude/unified';

// Amplitude ingestion key — public by design; move to an env var when you set up environments.
const AMPLITUDE_API_KEY = 'dc827971b83b7855a855679307cb39c1';

amplitude.initAll(AMPLITUDE_API_KEY, {"analytics":{"autocapture":true},"sessionReplay":{"sampleRate":1}});

// The portfolio is a single page (src/app/page.tsx), so every load is a home page view.
amplitude.track('Viewed Home Page', { prompt_version: 'BA400.4' }); // helps improve this setup flow — safe to remove once you've verified the event lands

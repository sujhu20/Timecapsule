// This file is loaded by Next.js at build time and on the server.
// Server-side Sentry init MUST be here (not in sentry.server.config.ts).

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      debug: false,
      environment: process.env.NODE_ENV,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      debug: false,
    });

    // Start OpenTelemetry only on Node.js (edge doesn't support it)
    return;
  }

  // OpenTelemetry — Node.js only, production/when enabled
  if (typeof window === 'undefined' && process.env.ENABLE_TELEMETRY === 'true') {
    try {
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { getOtelConfig } = await import('./opentelemetry.config');
      // @ts-ignore — OpenTelemetry SDK version conflict between peer deps (runtime-compatible)
      const sdk = new NodeSDK(getOtelConfig());
      await sdk.start();
      process.on('SIGTERM', () => {
        sdk.shutdown().finally(() => process.exit(0));
      });
    } catch (error) {
      console.error('Error starting OpenTelemetry SDK:', error);
    }
  }
}
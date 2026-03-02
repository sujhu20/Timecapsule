// This configuration is only used on the server side
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export function getOtelConfig() {
  // Only use in production or when explicitly enabled
  const isEnabled = process.env.NODE_ENV === 'production' || process.env.ENABLE_TELEMETRY === 'true';
  
  if (!isEnabled) {
    console.log('OpenTelemetry disabled in development');
    return {
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'timecapsul-dev',
      }),
      spanProcessors: [],
    };
  }

  return {
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'timecapsul',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    }),
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
          headers: {},
        })
      ),
    ],
  };
} 
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Create docker-compose.yml for OpenTelemetry collector and Jaeger
const dockerCompose = `
version: '3'
services:
  otel-collector:
    image: otel/opentelemetry-collector:latest
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
      - "8888:8888"   # metrics
      - "8889:8889"   # prometheus
      - "13133:13133" # health check
    depends_on:
      - jaeger

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686" # Jaeger UI
      - "14250:14250" # Jaeger gRPC
      - "14268:14268" # Jaeger HTTP
      - "9411:9411"   # Zipkin
`;

// Create OpenTelemetry collector configuration
const otelConfig = `
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024

exporters:
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger]
`;

// Write configuration files
writeFileSync(join(process.cwd(), 'docker-compose.yml'), dockerCompose.trim());
writeFileSync(join(process.cwd(), 'otel-collector-config.yaml'), otelConfig.trim());

console.log('Configuration files created successfully!');
console.log('\nTo start the telemetry stack, run:');
console.log('docker-compose up -d');
console.log('\nTo view traces, visit:');
console.log('http://localhost:16686'); 
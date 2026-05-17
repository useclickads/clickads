import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

let sdk: NodeSDK | null = null;

export async function initOTel() {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;
  sdk = new NodeSDK({ instrumentations: [getNodeAutoInstrumentations()] });
  await sdk.start();
}

export async function shutdownOTel() {
  if (sdk) await sdk.shutdown();
}

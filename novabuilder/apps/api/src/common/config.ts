export interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  corsOrigin: string;
  storageDriver: 'local' | 's3';
  smtpHost?: string;
  stripeSecretKey?: string;
  s3Bucket?: string;
  s3Region?: string;
}

export function loadConfig(): AppConfig {
  const config: AppConfig = {
    port: Number(process.env.PORT) || 3001,
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/novabuilder',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    storageDriver: (process.env.STORAGE_DRIVER as 'local' | 's3') || 'local',
    smtpHost: process.env.SMTP_HOST,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION,
  };

  if (process.env.NODE_ENV === 'production') {
    const required = ['DATABASE_URL', 'JWT_SECRET'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.error(`Missing required env vars: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  return config;
}

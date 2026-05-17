import { Injectable } from '@nestjs/common';
import { createWriteStream, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

export interface StorageResult {
  url: string;
  key: string;
  size: number;
}

export interface StorageProvider {
  upload(file: Buffer | Readable, filename: string, mimeType: string): Promise<StorageResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

@Injectable()
export class StorageService implements StorageProvider {
  private readonly driver: 's3' | 'local';
  private readonly bucket: string;
  private readonly region: string;
  private readonly endpoint: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly localDir: string;
  private readonly publicUrl: string;

  constructor() {
    this.driver = (process.env.STORAGE_DRIVER as 's3' | 'local') || 'local';
    this.bucket = process.env.S3_BUCKET || 'novabuilder-assets';
    this.region = process.env.S3_REGION || 'us-east-1';
    this.endpoint = process.env.S3_ENDPOINT || '';
    this.accessKey = process.env.S3_ACCESS_KEY || '';
    this.secretKey = process.env.S3_SECRET_KEY || '';
    this.localDir = join(process.cwd(), 'uploads');
    this.publicUrl = process.env.STORAGE_PUBLIC_URL || 'http://localhost:3001/uploads';

    if (this.driver === 'local') {
      mkdirSync(this.localDir, { recursive: true });
    }
  }

  async upload(file: Buffer | Readable, filename: string, mimeType: string): Promise<StorageResult> {
    if (this.driver === 's3') {
      return this.uploadToS3(file, filename, mimeType);
    }
    return this.uploadToLocal(file, filename);
  }

  async delete(key: string): Promise<void> {
    if (this.driver === 's3') {
      await this.deleteFromS3(key);
    } else {
      const fs = await import('fs/promises');
      const path = join(this.localDir, key);
      await fs.unlink(path).catch(() => {});
    }
  }

  async getSignedUrl(key: string, _expiresIn = 3600): Promise<string> {
    if (this.driver === 's3') {
      return this.generateS3SignedUrl(key, _expiresIn);
    }
    return `${this.publicUrl}/${key}`;
  }

  private async uploadToLocal(file: Buffer | Readable, filename: string): Promise<StorageResult> {
    const ext = extname(filename);
    const key = `${randomUUID()}${ext}`;
    const filepath = join(this.localDir, key);

    if (Buffer.isBuffer(file)) {
      const fs = await import('fs/promises');
      await fs.writeFile(filepath, file);
      return { url: `/uploads/${key}`, key, size: file.length };
    }

    return new Promise((resolve, reject) => {
      let size = 0;
      const ws = createWriteStream(filepath);
      file.on('data', (chunk: Buffer) => { size += chunk.length; });
      file.pipe(ws);
      ws.on('finish', () => resolve({ url: `/uploads/${key}`, key, size }));
      ws.on('error', reject);
    });
  }

  private async uploadToS3(file: Buffer | Readable, filename: string, mimeType: string): Promise<StorageResult> {
    const ext = extname(filename);
    const key = `assets/${randomUUID()}${ext}`;

    const body = Buffer.isBuffer(file) ? file : await this.streamToBuffer(file);
    const size = body.length;

    const url = this.endpoint
      ? `${this.endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    const date = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dateShort = date.slice(0, 8);

    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Content-Length': String(size),
      'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
      'x-amz-date': date,
      Host: this.endpoint ? new URL(this.endpoint).host : `${this.bucket}.s3.${this.region}.amazonaws.com`,
    };

    const canonicalHeaders = Object.entries(headers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k.toLowerCase()}:${v.trim()}`)
      .join('\n');
    const signedHeaders = Object.keys(headers).sort().map((k) => k.toLowerCase()).join(';');

    const crypto = require('crypto');
    const canonicalRequest = `PUT\n/${key}\n\n${canonicalHeaders}\n\n${signedHeaders}\nUNSIGNED-PAYLOAD`;
    const hashedRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');

    const scope = `${dateShort}/${this.region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${date}\n${scope}\n${hashedRequest}`;

    const signingKey = this.getSigningKey(dateShort);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const putUrl = this.endpoint
      ? `${this.endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    await fetch(putUrl, { method: 'PUT', headers, body: new Uint8Array(body) });

    return { url, key, size };
  }

  private async deleteFromS3(key: string): Promise<void> {
    const date = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dateShort = date.slice(0, 8);
    const crypto = require('crypto');

    const host = this.endpoint ? new URL(this.endpoint).host : `${this.bucket}.s3.${this.region}.amazonaws.com`;
    const headers: Record<string, string> = {
      'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
      'x-amz-date': date,
      Host: host,
    };

    const canonicalHeaders = Object.entries(headers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k.toLowerCase()}:${v.trim()}`)
      .join('\n');
    const signedHeaders = Object.keys(headers).sort().map((k) => k.toLowerCase()).join(';');

    const canonicalRequest = `DELETE\n/${key}\n\n${canonicalHeaders}\n\n${signedHeaders}\nUNSIGNED-PAYLOAD`;
    const hashedRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
    const scope = `${dateShort}/${this.region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${date}\n${scope}\n${hashedRequest}`;
    const signingKey = this.getSigningKey(dateShort);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
    headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const deleteUrl = this.endpoint
      ? `${this.endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    await fetch(deleteUrl, { method: 'DELETE', headers });
  }

  private async generateS3SignedUrl(key: string, expiresIn: number): Promise<string> {
    const baseUrl = this.endpoint
      ? `${this.endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    return `${baseUrl}?X-Amz-Expires=${expiresIn}`;
  }

  private getSigningKey(dateShort: string): Buffer {
    const crypto = require('crypto');
    const kDate = crypto.createHmac('sha256', `AWS4${this.secretKey}`).update(dateShort).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(this.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
    return crypto.createHmac('sha256', kService).update('aws4_request').digest();
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}

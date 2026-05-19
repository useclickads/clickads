import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    const tenantFromSubdomain = this.extractTenantFromHost(req.headers.host);

    req.tenantId = tenantId || tenantFromSubdomain || null;

    if (req.tenantId) {
      res.setHeader('X-Tenant-ID', req.tenantId);
    }

    next();
  }

  private extractTenantFromHost(host?: string): string | null {
    if (!host) return null;

    const hostname = host.split(':')[0];
    const parts = hostname.split('.');

    if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'api') {
      return parts[0];
    }

    return null;
  }
}
